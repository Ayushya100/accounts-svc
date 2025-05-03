'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { isRouteAvailable, registerNewRoute } from '../../db/index.js';
import { getRouteInfoById } from './getRouteConfig.controller.js';

const log = logger('Controller: register-route-config');

const verifyRouteConfigExist = async (payload) => {
  try {
    log.info('Controller for validating route configuration activated');
    payload.svcId = convertPrettyStringToId(payload.svcId);

    log.info('Call db query to validate if route configuration already exists');
    const configExist = await isRouteAvailable(payload);
    if (configExist.rowCount > 0) {
      log.error('Route config already exists in system');
      return {
        status: 409,
        message: 'Route config already exists',
        data: [],
        errors: [],
        stack: 'verifyRouteConfigExist function call',
        isValid: false,
      };
    }

    log.success('Route configuration verification completed successfully');
    return {
      status: 200,
      message: 'Route config does not exists in system',
      data: {},
      isValid: true,
    };
  } catch (err) {
    log.error('Error while validating new route configuration in system');
    return {
      status: 500,
      message: 'An error occurred while validating route config in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const registerNewRouteConfig = async (payload) => {
  try {
    log.info('Controller function to register new route config initiated');
    payload.svcId = convertPrettyStringToId(payload.svcId);
    payload.validations = payload.validations || [];

    log.info('Call db query to register new route config in system');
    const newRoute = await registerNewRoute(payload);
    const newRouteId = newRoute.rows[0].id;
    const newRouteDtl = await getRouteInfoById(newRouteId);

    log.success('New route configuration registered successfully in system');
    return {
      status: 201,
      message: 'New route configuration registered',
      data: newRouteDtl.data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while registering new route configuration in system');
    return {
      status: 500,
      message: 'An error occurred while registering route config in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { verifyRouteConfigExist, registerNewRouteConfig };
