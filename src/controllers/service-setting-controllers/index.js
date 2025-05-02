'use strict';

import { verifyConfigExist, registerNewConfig } from './registerServiceConfig.controller.js';
import { getServiceInfoById, getAllServiceInfo } from './getServiceConfig.controller.js';
import { verifyRouteConfigExist, registerNewRouteConfig } from './registerRouteConfig.controller.js';
import { getRouteInfoById, getAllRouteInfo } from './getRouteConfig.controller.js';
import { updateServiceConfig } from './updateServiceConfig.controller.js';
import { deleteService } from './deleteServiceConfig.controller.js';

export default {
  verifyConfigExist,
  registerNewConfig,
  getServiceInfoById,
  getAllServiceInfo,
  verifyRouteConfigExist,
  registerNewRouteConfig,
  getRouteInfoById,
  getAllRouteInfo,
  updateServiceConfig,
  deleteService,
};
