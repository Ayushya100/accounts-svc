'use strict';

import { logger } from 'finance-lib';
import { isServiceAvailable, registerNewService } from '../../db/index.js';
import { getServiceInfoById } from './getServiceConfig.controller.js';

const log = logger('Controller: register-service-config');

const verifyConfigExist = async (payload) => {
  try {
    log.info('Controller for validating service configuration activated');
    log.info('Call db query to validate if service already exists');
    const configDtl = await isServiceAvailable(payload.microservice, payload.environment, payload.protocol);
    if (configDtl.rowCount > 0) {
      log.error('Service config already exists in system');
      return {
        status: 409,
        message: 'Service config already exists',
        data: configDtl.rows,
        errors: [],
        stack: 'verifyConfigExist function call',
        isValid: false,
      };
    }

    log.success('Service configuration verification completed successfully');
    return {
      status: 200,
      message: 'Service config does not exists in system',
      data: {},
      isValid: true,
    };
  } catch (err) {
    log.error('Error while validating new service configuration in system');
    return {
      status: 500,
      message: 'An error occurred while validating service config in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const registerNewConfig = async (payload) => {
  try {
    log.info('Controller function to register new service config initiated');
    log.info('Call db query to register new service config in system');
    const newService = await registerNewService(payload);
    const newServiceId = newService.rows[0].id;

    const newServiceDtl = await getServiceInfoById(newServiceId);

    log.success('New service configuration registered successfully in system');
    return {
      status: 201,
      message: 'New service configuration registered',
      data: newServiceDtl.data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while registering new service configuration in system');
    return {
      status: 500,
      message: 'An error occurred while registering service config in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { verifyConfigExist, registerNewConfig };
