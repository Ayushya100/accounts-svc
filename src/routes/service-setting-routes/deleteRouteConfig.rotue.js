'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: delete-route-config-by-id');
const serviceController = controllers.serviceController;

// API Function
const deleteRouteConfig = async (req, res, next) => {
  try {
    log.info('Route configuration deletion operation initiated');
    const routeId = req.params.routeId;
    const userId = req.user.id;

    log.info('Call controller function to validate if route for requested id exists');
    const routeDtl = await serviceController.getRouteInfoById(routeId);
    if (!routeDtl.isValid) {
      throw routeDtl;
    }

    log.info('Call controller function to delete the route info for provided id');
    const deletedRouteDtl = await serviceController.deleteRoute(userId, routeId);
    if (!deletedRouteDtl.isValid) {
      throw deletedRouteDtl;
    }

    log.success('Route configuration deletion operation completed successfully');
    res.status(200).json(buildApiResponse(deletedRouteDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default deleteRouteConfig;
