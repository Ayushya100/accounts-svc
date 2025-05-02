'use strict';

import { convertIdToPrettyString, convertPrettyStringToId, convertToNativeTimeZone, logger } from 'finance-lib';
import { getRouteById } from '../../db/index.js';

const log = logger('Controller: get-service-config');

const getRouteInfoById = async (routeId) => {
  try {
    log.info('Controller function to fetch route info by id process initiated');
    routeId = convertPrettyStringToId(routeId);

    log.info(`Call db query to fetch route details for provided id: ${routeId}`);
    let configDtl = await getRouteById(routeId);
    if (configDtl.rowCount === 0) {
      log.error('Route configuration requested with the id does not exists in system');
      return {
        status: 404,
        message: 'Route config not found',
        data: [],
        errors: [],
        stack: 'getRouteById function call',
        isValid: false,
      };
    }

    configDtl = configDtl.rows[0];
    configDtl = {
      id: convertIdToPrettyString(configDtl.id),
      path: configDtl.path,
      method: configDtl.method,
      validations: configDtl.validations,
      createdDate: convertToNativeTimeZone(configDtl.created_date),
      modifiedDate: convertToNativeTimeZone(configDtl.modified_date),
      service: {
        id: configDtl.svc_id,
        microservice: configDtl.microservice,
      },
    };

    log.success('Requested route details fetched successfully');
    return {
      status: 200,
      message: 'Route info fetched successfully',
      data: configDtl,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while fetching route configuration for requested id from system');
    return {
      status: 500,
      message: 'An error occurred while fetching route info for requested id from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { getRouteInfoById };
