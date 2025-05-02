'use strict';

import { logger, buildApiResponse } from 'finance-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: get-user-role-by-id');
const serviceController = controllers.serviceController;

// API Function
const getRouteConfigById = async (req, res, next) => {
  try {
    log.info('Get route config by id operation initiated');
    const routeId = req.params.routeId;

    log.info('Call controller function to fetch route configuration for requested id');
    const configDtl = await serviceController.getRouteInfoById(routeId);
    if (!configDtl.isValid) {
      throw configDtl;
    }

    log.success('Route configuration by id process completed successfully');
    res.status(200).json(buildApiResponse(configDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default getRouteConfigById;
