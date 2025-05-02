'use strict';

import { logger, buildApiResponse } from 'finance-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: get-all-service-config');
const serviceController = controllers.serviceController;

// API Function
const getAllServiceConfig = async (req, res, next) => {
  try {
    log.info('Get all service configuration process initiated');
    log.info('Call controller function to fetch all service info from system');
    const serviceDtl = await serviceController.getAllServiceInfo();
    if (!serviceDtl.isValid) {
      throw serviceDtl;
    }

    log.success('Service configurations fetched successfully');
    res.status(200).json(buildApiResponse(serviceDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default getAllServiceConfig;
