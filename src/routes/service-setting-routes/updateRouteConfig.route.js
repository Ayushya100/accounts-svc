'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: update-route-config');
const serviceController = controllers.serviceController;

// API Function
const updateRouteConfig = async (req, res, next) => {
  try {
    log.info('Route configuration update for requested id operation initiated');
    const routeId = req.params.routeId;
    const payload = req.body;
    const userId = req.user.id;

    log.info('Call controller function to validate if route configuration for provided id exist');
    const routeDtl = await serviceController.getRouteInfoById(routeId);
    if (!routeDtl.isValid) {
      throw routeDtl;
    }

    if (payload.svcId) {
      log.info('Call controller function to validate if service configuration for provided id exist');
      const svcDtl = await serviceController.getServiceInfoById(payload.svcId);
      if (!svcDtl.isValid) {
        throw svcDtl;
      }
    }

    log.info('Call controller function to update route info');
    const updatedRouteDtl = await serviceController.updateRouteConfig(userId, routeId, routeDtl.data, payload);
    if (!updatedRouteDtl.isValid) {
      throw updatedRouteDtl;
    }

    log.success('Route configuration update operation completed successfully');
    res.status(200).json(buildApiResponse(updatedRouteDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default updateRouteConfig;
