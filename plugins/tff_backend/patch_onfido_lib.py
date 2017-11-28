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

from onfido.rest import RESTClientObject
from urllib3.contrib.appengine import AppEngineManager


def new_restapiclient_init(self, pools_size=4):
    self.pool_manager = AppEngineManager()


def patch_onfido_lib():
    RESTClientObject.__init__ = new_restapiclient_init
