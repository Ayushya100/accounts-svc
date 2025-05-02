'use strict';

import { convertIdToPrettyString, convertPrettyStringToId, convertToNativeTimeZone, logger } from 'finance-lib';
import { getServiceById } from '../../db/index.js';

const log = logger('Controller: get-service-config');

const getServiceInfoById = async (svcId) => {
  try {
    log.info('Controller function to fetch service info by id process initiated');
    svcId = convertPrettyStringToId(svcId);

    log.info(`Call db query to fetch service details for provided id: ${svcId}`);
    let configDtl = await getServiceById(svcId);
    if (configDtl.rowCount === 0) {
      log.error('Service configuration requested with the id does not exists in system');
      return {
        status: 404,
        message: 'Service config not found',
        data: [],
        errors: [],
        stack: 'getServiceById function call',
        isValid: false,
      };
    }

    configDtl = configDtl.rows[0];
    configDtl = {
      id: convertIdToPrettyString(configDtl.id),
      microservice: configDtl.microservice,
      environment: configDtl.environment,
      protocol: configDtl.protocol,
      port: configDtl.port,
      createdDate: convertToNativeTimeZone(configDtl.created_date),
      modifiedDate: convertToNativeTimeZone(configDtl.modified_date),
    };

    log.success('Requested service details fetched successfully');
    return {
      status: 200,
      message: 'Service info fetched successfully',
      data: configDtl,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while fetching service configuration for requested id from system');
    return {
      status: 500,
      message: 'An error occurred while fetching service info for requested id from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { getServiceInfoById };
