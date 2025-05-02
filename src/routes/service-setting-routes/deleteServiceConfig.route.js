'use strict';

import { logger, buildApiResponse } from 'finance-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: delete-service-config-by-id');
const serviceController = controllers.serviceController;

// API Function
const deleteServiceConfig = async (req, res, next) => {
  try {
    log.info('Service configuration deletion operation initiated');
    const svcId = req.params.svcId;
    const userId = req.user.id;

    log.info('Call controller function to validate if service for requested id exists');
    const svcDtl = await serviceController.getServiceInfoById(svcId);
    if (!svcDtl.isValid) {
      throw svcDtl;
    }

    log.info('Call controller function to delete the service info for provided id');
    const deletedSvcDtl = await serviceController.deleteService(userId, svcId);
    if (!deletedSvcDtl.isValid) {
      throw deletedSvcDtl;
    }

    log.success('Service configuration deletion operation completed successfully');
    res.status(200).json(buildApiResponse(deletedSvcDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default deleteServiceConfig;
