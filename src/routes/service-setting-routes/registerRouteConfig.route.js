'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: register-route-config');
const serviceController = controllers.serviceController;

// API Function
const registerRouteConfig = async (req, res, next) => {
  try {
    log.info('Register service route request process initiated');
    const payload = req.body;
    const svcId = payload.svcId;

    log.info('Call controller function to check if service configuration for provided service id exist');
    const svcDtl = await serviceController.getServiceInfoById(svcId);
    if (!svcDtl.isValid) {
      throw svcDtl;
    }

    log.info('Call controller function to validate if route already exists');
    const configExist = await serviceController.verifyRouteConfigExist(payload);
    if (!configExist.isValid) {
      throw configExist;
    }

    log.info('Call controller function to register new service route in system');
    const configDtl = await serviceController.registerNewRouteConfig(payload);
    if (!configDtl.isValid) {
      throw configDtl;
    }

    log.success('Service route registeration completed successfully');
    res.status(201).json(buildApiResponse(configDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default registerRouteConfig;
