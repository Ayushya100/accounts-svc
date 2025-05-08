'use strict';

import { convertIdToPrettyString, convertPrettyStringToId, convertToNativeTimeZone, logger } from 'common-node-lib';
import { getRouteById, getRouteConfig } from '../../db/index.js';

const log = logger('Controller: get-route-config');

const getRouteInfoById = async (routeId, deletedRecord = false) => {
  try {
    log.info('Controller function to fetch route info by id process initiated');
    routeId = convertPrettyStringToId(routeId);

    log.info(`Call db query to fetch route details for provided id: ${routeId}`);
    let configDtl = await getRouteById(routeId, deletedRecord);
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
      core: configDtl.core,
      createdDate: convertToNativeTimeZone(configDtl.created_date),
      modifiedDate: convertToNativeTimeZone(configDtl.modified_date),
      service: {
        id: convertIdToPrettyString(configDtl.svc_id),
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

const getAllRouteInfo = async () => {
  try {
    log.info('Controller function to fetch all route configurations from system activated');
    log.info('Call db query to fetch all route config from db');
    let routeDtl = await getRouteConfig();
    if (routeDtl.rowCount === 0) {
      log.info('No route configuration available to display');
      return {
        status: 204,
        message: 'No route config found',
        data: [],
        isValid: true,
      };
    }

    routeDtl = routeDtl.rows;
    const data = routeDtl.map((routeDtl) => {
      return {
        id: convertIdToPrettyString(routeDtl.id),
        path: routeDtl.path,
        method: routeDtl.method,
        service: {
          id: convertIdToPrettyString(routeDtl.svc_id),
          microservice: routeDtl.microservice,
        },
      };
    });

    log.success('Route configuration operation completed successfully');
    return {
      status: 200,
      message: 'Route configuration fetched successfully',
      data: data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while retrieving all route configurations from system');
    return {
      status: 500,
      message: 'An error occurred while retrieving all route configurations from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { getRouteInfoById, getAllRouteInfo };
