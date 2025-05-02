'use strict';

import { logger, buildApiResponse } from 'finance-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: register-service-config');
const serviceController = controllers.serviceController;

// API Function
const updateServiceConfig = async (req, res, next) => {
  try {
    log.info('Service configuration update for requested id operation initiated');
    const svcId = req.params.svcId;
    const payload = req.body;
    const userId = req.user.id;

    log.info('Call controller function to validate if service configuration for provided id exists');
    const svcDtl = await serviceController.getServiceInfoById(svcId);
    if (!svcDtl.isValid) {
      throw svcDtl;
    }

    log.info('Call controller function to update service info');
    const updatedSvcDtl = await serviceController.updateServiceConfig(userId, svcId, svcDtl.data, payload);
    if (!updatedSvcDtl.isValid) {
      throw updatedSvcDtl;
    }

    log.success('Service configuration update operation completed successfully');
    res.status(200).json(buildApiResponse(updatedSvcDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default updateServiceConfig;
