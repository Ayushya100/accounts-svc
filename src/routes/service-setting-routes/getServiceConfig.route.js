'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: get-all-service-config');
const serviceController = controllers.serviceController;

// API Function
const getServiceConfig = async (req, res, next) => {
  try {
    log.info('Get service configuration process initiated');
    const svcId = req.params.svcId;

    let serviceDtl = {};
    if (svcId) {
      log.info('Call controller function to fetch service configuration for requested id');
      serviceDtl = await serviceController.getServiceInfoById(svcId);
    } else {
      log.info('Call controller function to fetch all service info from system');
      serviceDtl = await serviceController.getAllServiceInfo();
    }
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

export default getServiceConfig;
