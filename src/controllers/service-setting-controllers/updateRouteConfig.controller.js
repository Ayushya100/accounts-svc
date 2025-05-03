'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { updateRouteInfoById } from '../../db/system.db.js';
import { getRouteInfoById } from './getRouteConfig.controller.js';

const log = logger('Controller: update-route-config');

const updateRouteConfig = async (userId, routeId, routeDtl, payload) => {
  try {
    log.info('Controller function to update route configuration in system initiated');

    payload.path = payload.path || routeDtl.path;
    payload.method = payload.method || routeDtl.method;
    payload.validations = payload.validations || routeDtl.validations;
    payload.svcId = payload.svcId ? convertPrettyStringToId(payload.svcId) : convertPrettyStringToId(routeDtl.service.id);

    routeId = convertPrettyStringToId(routeId);
    userId = convertPrettyStringToId(userId);

    log.info('Call db query to update route configuration');
    await updateRouteInfoById(routeId, userId, payload);
    let updatedRouteDtl = await getRouteInfoById(routeId);
    updatedRouteDtl = updatedRouteDtl.data;

    log.success('Route configuration updated successfully in system');
    return {
      status: 200,
      message: 'Route configuration updated successfully',
      data: updatedRouteDtl,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while updating route configuration in system');
    return {
      status: 500,
      message: 'An error occurred while updating route configuration info in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { updateRouteConfig };
