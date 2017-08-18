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

from framework.plugin_loader import get_config
from mcfw.consts import DEBUG
from plugins.tff_backend.plugin_consts import NAMESPACE


def get_rogerthat_api_key():
    rt_cfg = get_config(NAMESPACE).rogerthat
    if DEBUG:
        return rt_cfg.dev.api_key
    else:
        return rt_cfg.prod.api_key
