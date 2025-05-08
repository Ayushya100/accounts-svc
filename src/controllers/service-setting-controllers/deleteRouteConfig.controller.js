'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { deleteRouteInfoById } from '../../db/index.js';
import { getRouteInfoById } from './getRouteConfig.controller.js';

const log = logger('Controller: delete-route-config');

const deleteRoute = async (userId, routeId, routeDtl) => {
  try {
    log.info('Controller function to delete route configuration from system process initiated');
    routeId = convertPrettyStringToId(routeId);
    userId = convertPrettyStringToId(userId);

    if (routeDtl.core) {
      log.error('Cannot delete the core path configuration');
      return {
        status: 400,
        message: 'Core path configuration cannot be deleted',
        data: [],
        errors: [],
        stack: 'deleteScope function call',
        isValid: false,
      };
    }

    log.info('Call db query to soft delete the route into from system');
    await deleteRouteInfoById(routeId, userId);
    let deletedRouteDtl = await getRouteInfoById(routeId, true);
    deletedRouteDtl = deletedRouteDtl.data;

    log.success('Route info deletion operation completed successfully');
    return {
      status: 200,
      message: 'Route info deleted successfully',
      data: deletedRouteDtl,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while deleting route configuration from system');
    return {
      status: 500,
      message: 'An error occurred while deleting route configuration from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { deleteRoute };
