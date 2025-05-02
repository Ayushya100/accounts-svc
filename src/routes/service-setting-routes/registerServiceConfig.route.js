'use strict';

import { logger, buildApiResponse } from 'finance-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: register-service-config');
const serviceController = controllers.serviceController;

// API Function
const registerServiceConfig = async (req, res, next) => {
  try {
    log.info('Register service config request process initiated');
    const payload = req.body;

    log.info('Call controller function to validate if service config already exists');
    const configExist = await serviceController.verifyConfigExist(payload);
    if (!configExist.isValid) {
      throw configExist;
    }

    log.info('Call controller function to register new service config in system');
    const serviceDtl = await serviceController.registerNewConfig(payload);
    if (!serviceDtl.isValid) {
      throw serviceDtl;
    }

    log.success('Service registeration completed successfully');
    res.status(201).json(buildApiResponse(serviceDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default registerServiceConfig;
