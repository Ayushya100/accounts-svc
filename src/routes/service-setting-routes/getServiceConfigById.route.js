'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: get-service-config-by-id');
const serviceController = controllers.serviceController;

// API Function
const getServiceConfigById = async (req, res, next) => {
  try {
    log.info('Get service config by id operation initiated');
    const svcId = req.params.svcId;

    log.info('Call controller function to fetch service configuration for requested id');
    const configDtl = await serviceController.getServiceInfoById(svcId);
    if (!configDtl.isValid) {
      throw configDtl;
    }

    log.success('Service configuration by id process completed successfully');
    res.status(200).json(buildApiResponse(configDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default getServiceConfigById;
