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

from __future__ import unicode_literals

import re

from framework.plugin_loader import get_config
from plugins.its_you_online_auth.plugin_consts import NAMESPACE as IYO_NAMESPACE

config = get_config(IYO_NAMESPACE)
ROOT_ORGANIZATION = config.root_organization.name
USERS_REGEX = re.compile('^user:memberof:%s\.(.*)' % ROOT_ORGANIZATION)


class RogerthatRoles(object):
    PUBLIC = 'public'
    HOSTERS = 'hosters'
    MEMBERS = 'members'
    INVESTOR = 'investors'


class Roles(object):
    BACKEND = 'backend'
    BACKEND_ADMIN = 'backend.admin'
    BACKEND_READONLY = 'backend.readonly'
    PUBLIC = 'public'
    HOSTERS = 'hosters'
    MEMBERS = 'members'
    INVESTOR = 'investors'


class Organization(object):
    BACKEND = '%s.%s' % (ROOT_ORGANIZATION, Roles.BACKEND)
    BACKEND_ADMIN = '%s.%s' % (ROOT_ORGANIZATION, Roles.BACKEND_ADMIN)
    BACKEND_READONLY = '%s.%s' % (ROOT_ORGANIZATION, Roles.BACKEND_READONLY)
    PUBLIC = '%s.%s' % (ROOT_ORGANIZATION, Roles.PUBLIC)
    MEMBERS = '%s.%s' % (ROOT_ORGANIZATION, Roles.MEMBERS)

    ROLES = {
        Roles.BACKEND: BACKEND,
        Roles.BACKEND_ADMIN: BACKEND,
        Roles.PUBLIC: PUBLIC,
        Roles.MEMBERS: MEMBERS,
    }

    @staticmethod
    def get_by_role_name(role_name):
        return Organization.ROLES.get(role_name, None)


class Scope(object):
    _memberof = 'user:memberof:%s'
    ROOT_ADMINS = _memberof % ROOT_ORGANIZATION
    BACKEND = _memberof % Organization.BACKEND
    BACKEND_ADMIN = _memberof % Organization.BACKEND_ADMIN
    BACKEND_READONLY = _memberof % Organization.BACKEND_READONLY
    PUBLIC = _memberof % Organization.PUBLIC
    MEMBERS = _memberof % Organization.MEMBERS


class Scopes(object):
    BACKEND_ADMIN = [Scope.ROOT_ADMINS, Scope.BACKEND, Scope.BACKEND_ADMIN]
    BACKEND_READONLY = BACKEND_ADMIN + [Scope.BACKEND_READONLY]
    PUBLIC = BACKEND_READONLY + [Scope.PUBLIC]
    MEMBERS = PUBLIC + [Scope.MEMBERS]


def get_permissions_from_scopes(scopes):
    permissions = []
    for scope in scopes:
        if scope == Scope.ROOT_ADMINS:
            permissions.append(Roles.BACKEND_ADMIN)
            break
        users_re = USERS_REGEX.match(scope)
        # e.g. {root_org}.members
        if users_re:
            groups = users_re.groups()
            permissions.append(groups[0])
    return permissions


def get_permission_strings(scopes):
    return ['tff.%s' % p for p in get_permissions_from_scopes(scopes)]
