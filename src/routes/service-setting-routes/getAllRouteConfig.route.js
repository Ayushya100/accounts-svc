'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: get-all-route-config');
const serviceController = controllers.serviceController;

// API Function
const getAllRouteConfig = async (req, res, next) => {
  try {
    log.info('Get all route configuration process initiated');
    log.info('Call controller function to fetch all route info from system');
    const routeDtl = await serviceController.getAllRouteInfo();
    if (!routeDtl.isValid) {
      throw routeDtl;
    }

    res.status(200).json(buildApiResponse(routeDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default getAllRouteConfig;
