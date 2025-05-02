'use strict';

import { convertPrettyStringToId, logger } from 'finance-lib';
import { updateServiceInfoById } from '../../db/system.db.js';
import { getServiceInfoById } from './getServiceConfig.controller.js';

const log = logger('Controller: update-user-role');

const updateServiceConfig = async (userId, svcId, svcDtl, payload) => {
  try {
    log.info('Controller function to update service configuration in system initiated');
    payload.microservice = payload.microservice || svcDtl.microservice;
    payload.environment = payload.environment || svcDtl.environment;
    payload.protocol = payload.protocol || svcDtl.protocol;
    payload.port = payload.port || svcDtl.port;

    svcId = convertPrettyStringToId(svcId);
    userId = convertPrettyStringToId(userId);

    log.info('Call db query to update service configuration');
    await updateServiceInfoById(svcId, userId, payload);
    let updatedSvcDtl = await getServiceInfoById(svcId);
    updatedSvcDtl = updatedSvcDtl.data;

    log.success('Service configuration updated successfully in system');
    return {
      status: 200,
      message: 'Service configuration updated successfully',
      data: updatedSvcDtl,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while updating service configuration in system');
    return {
      status: 500,
      message: 'An error occurred while updating service configuration info in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { updateServiceConfig };
