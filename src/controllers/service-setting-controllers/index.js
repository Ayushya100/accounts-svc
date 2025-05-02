'use strict';

import { verifyConfigExist, registerNewConfig } from './registerServiceConfig.controller.js';
import { getServiceInfoById, getAllServiceInfo } from './getServiceConfig.controller.js';

export default { verifyConfigExist, registerNewConfig, getServiceInfoById, getAllServiceInfo };
