# -*- coding: utf-8 -*-
# Copyright 2017 GIG Technology NV
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# @@license_version:1.3@@
import datetime
import json
import logging

from google.appengine.ext.deferred import deferred

from mcfw.consts import DEBUG
from mcfw.properties import object_factory
from mcfw.rpc import arguments, returns
from onfido import Applicant, Address
from onfido.rest import ApiException
from plugins.its_you_online_auth.bizz.profile import index_profile
from plugins.its_you_online_auth.models import Profile
from plugins.rogerthat_api.exceptions import BusinessException
from plugins.rogerthat_api.to import UserDetailsTO
from plugins.rogerthat_api.to.messaging.flow import FLOW_STEP_MAPPING, FormFlowStepTO
from plugins.rogerthat_api.to.messaging.forms import FormResultTO, UnicodeWidgetResultTO, LongWidgetResultTO
from plugins.rogerthat_api.to.messaging.service_callback_results import FlowMemberResultCallbackResultTO, \
    TYPE_FLOW, FlowCallbackResultTypeTO
from plugins.tff_backend.api.rogerthat.referrals import api_set_referral
from plugins.tff_backend.bizz.global_stats import ApiCallException
from plugins.tff_backend.bizz.iyo.utils import get_iyo_username
from plugins.tff_backend.bizz.kyc.onfido_bizz import update_applicant, create_applicant, upload_document
from plugins.tff_backend.bizz.rogerthat import create_error_message
from plugins.tff_backend.bizz.user import get_tff_profile, generate_kyc_flow
from plugins.tff_backend.models.user import KYCStatus
from plugins.tff_backend.plugin_consts import KYC_FLOW_PART_2_TAG
from plugins.tff_backend.utils import get_step

try:
    from cStringIO import StringIO
except ImportError:
    from StringIO import StringIO


class InvalidKYCStatusException(Exception):
    def __init__(self, status):
        self.status = status
        msg = 'Invalid KYC status %s' % status
        super(InvalidKYCStatusException, self).__init__(msg)


@returns(FlowMemberResultCallbackResultTO)
@arguments(message_flow_run_id=unicode, member=unicode, steps=[object_factory('step_type', FLOW_STEP_MAPPING)],
           end_id=unicode, end_message_flow_id=unicode, parent_message_key=unicode, tag=unicode, result_key=unicode,
           flush_id=unicode, flush_message_flow_id=unicode, service_identity=unicode, user_details=[UserDetailsTO],
           flow_params=unicode)
def kyc_part_1(message_flow_run_id, member, steps, end_id, end_message_flow_id, parent_message_key, tag,
               result_key, flush_id, flush_message_flow_id, service_identity, user_details, flow_params):
    iyo_username = get_iyo_username(user_details[0])
    if not iyo_username:
        logging.error('No username found for user %s', user_details[0])
        return create_error_message(FlowMemberResultCallbackResultTO())
    result = _validate_kyc_status(iyo_username)
    if isinstance(result, FlowMemberResultCallbackResultTO):
        return result
    step = get_step(steps, 'message_nationality') or get_step(steps, 'message_nationality_with_vibration')
    assert isinstance(step, FormFlowStepTO)
    assert isinstance(step.form_result, FormResultTO)
    assert isinstance(step.form_result.result, UnicodeWidgetResultTO)
    country_code = step.form_result.result.value
    ref_step = get_step(steps, 'message_referrer')
    if ref_step and not result.referrer_user:
        try:
            api_set_referral({'code': ref_step.get_value()}, user_details[0])
        except ApiCallException as e:
            return create_error_message(FlowMemberResultCallbackResultTO(), e.message)
    xml, flow_params = generate_kyc_flow(country_code, iyo_username)
    result = FlowCallbackResultTypeTO(flow=xml, tag=KYC_FLOW_PART_2_TAG, force_language=None,
                                      flow_params=json.dumps(flow_params))
    return FlowMemberResultCallbackResultTO(type=TYPE_FLOW, value=result)


@returns(FlowMemberResultCallbackResultTO)
@arguments(message_flow_run_id=unicode, member=unicode, steps=[object_factory('step_type', FLOW_STEP_MAPPING)],
           end_id=unicode, end_message_flow_id=unicode, parent_message_key=unicode, tag=unicode, result_key=unicode,
           flush_id=unicode, flush_message_flow_id=unicode, service_identity=unicode, user_details=[UserDetailsTO],
           flow_params=unicode)
def kyc_part_2(message_flow_run_id, member, steps, end_id, end_message_flow_id, parent_message_key, tag,
               result_key, flush_id, flush_message_flow_id, service_identity, user_details, flow_params):
    deferred.defer(_kyc_part_2, message_flow_run_id, member, steps, end_id, end_message_flow_id, parent_message_key,
                   tag, result_key, flush_id, flush_message_flow_id, service_identity, user_details, flow_params)


@returns(FlowMemberResultCallbackResultTO)
@arguments(message_flow_run_id=unicode, member=unicode, steps=[object_factory('step_type', FLOW_STEP_MAPPING)],
           end_id=unicode, end_message_flow_id=unicode, parent_message_key=unicode, tag=unicode, result_key=unicode,
           flush_id=unicode, flush_message_flow_id=unicode, service_identity=unicode, user_details=[UserDetailsTO],
           flow_params=unicode)
def _kyc_part_2(message_flow_run_id, member, steps, end_id, end_message_flow_id, parent_message_key, tag,
                result_key, flush_id, flush_message_flow_id, service_identity, user_details, flow_params):
    parsed_flow_params = json.loads(flow_params)
    applicant = Applicant(nationality=parsed_flow_params['nationality'], addresses=[Address()])
    documents = []

    def _set_attr(prop, value):
        if hasattr(applicant, prop):
            setattr(applicant, prop, value)
        elif prop.startswith('address_'):
            prop = prop.replace('address_', '')
            if prop == 'country':
                applicant.country = value
            setattr(applicant.addresses[0], prop, value)
        else:
            logging.warn('Ignoring unknown property %s with value %s', prop, value)
    for step in steps:
        assert isinstance(step, FormFlowStepTO)
        step_id_split = step.step_id.split('_', 1)
        if step_id_split[0] == 'message':
            prop = step_id_split[1]  # 'type' from one of plugins.tff_backend.consts.kyc.kyc_steps
            step_value = step.form_result.result.get_value()
            if prop.startswith('national_identity_card'):
                side = None
                if prop.endswith('front'):
                    side = 'front'
                elif prop.endswith('back'):
                    side = 'back'
                documents.append(
                    {'type': 'national_identity_card', 'side': side, 'value': step_value})
            elif prop.startswith('passport'):
                documents.append({'type': 'passport', 'value': step_value})
            elif isinstance(step.form_result.result, UnicodeWidgetResultTO):
                _set_attr(prop, step.form_result.result.value.strip())
            elif isinstance(step.form_result.result, LongWidgetResultTO):
                # date step
                date = datetime.datetime.utcfromtimestamp(step_value).strftime('%Y-%m-%d')
                _set_attr(prop, date)
            else:
                logging.info('Ignoring step %s', step)
    username = get_iyo_username(user_details[0])
    if not username:
        logging.error('Could not find username for user %s!' % user_details[0])
        return create_error_message(FlowMemberResultCallbackResultTO())
    result = _validate_kyc_status(username)
    if isinstance(result, FlowMemberResultCallbackResultTO):
        return result
    profile = get_tff_profile(username)
    try:
        if profile.kyc.applicant_id:
            applicant = update_applicant(profile.kyc.applicant_id, applicant)
        else:
            applicant = create_applicant(applicant)
            profile.kyc.applicant_id = applicant.id
    except ApiException as e:
        if e.status in xrange(400, 499):
            raise BusinessException('Invalid status code from onfido: %s %s' % (e.status, e.body))
        raise
    for document in documents:
        deferred.defer(upload_document, applicant.id, document['type'], document['value'], document.get('side'))
    profile.kyc.set_status(KYCStatus.SUBMITTED.value, username)
    profile.put()
    deferred.defer(index_profile, Profile.create_key(username))


def _validate_kyc_status(username):
    profile = get_tff_profile(username)
    if profile.kyc:
        status = profile.kyc.status
        if status not in (KYCStatus.UNVERIFIED, KYCStatus.PENDING_SUBMIT):
            message = None
            if status == KYCStatus.DENIED:
                message = 'Sorry, we are regrettably not able to accept you as a customer.'
            elif status == KYCStatus.PENDING_APPROVAL or status == KYCStatus.SUBMITTED:
                message = 'We already have the information we currently need to pass on to our KYC provider.' \
                          ' We will contact you if we need more info.' \
                          ' Please contact us if you want to update your information.'
            elif status == KYCStatus.VERIFIED:
                message = 'You have already been verified, so you do not need to enter this process again. Thank you!'
            if not DEBUG:
                return create_error_message(FlowMemberResultCallbackResultTO(), message)
    return profile
