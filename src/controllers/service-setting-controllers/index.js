'use strict';

import { verifyConfigExist, registerNewConfig } from './registerServiceConfig.controller.js';
import { getServiceInfoById, getAllServiceInfo } from './getServiceConfig.controller.js';
import { verifyRouteConfigExist, registerNewRouteConfig } from './registerRouteConfig.controller.js';
import { getRouteInfoById } from './getRouteConfig.controller.js';

export default { verifyConfigExist, registerNewConfig, getServiceInfoById, getAllServiceInfo, verifyRouteConfigExist, registerNewRouteConfig, getRouteInfoById };
