'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { deleteServiceInfoById } from '../../db/index.js';
import { getServiceInfoById } from './getServiceConfig.controller.js';

const log = logger('Controller: delete-service-config');

const deleteService = async (userId, svcId) => {
  try {
    log.info('Controller function to delete service configuration from system process initiated');
    svcId = convertPrettyStringToId(svcId);
    userId = convertPrettyStringToId(userId);

    log.info('Call db query to soft delete the service info from system');
    await deleteServiceInfoById(svcId, userId);
    let deletedServiceDtl = await getServiceInfoById(svcId, true);
    deletedServiceDtl = deletedServiceDtl.data;

    log.success('Service info deletion operation completed successfully');
    return {
      status: 200,
      message: 'Service info deleted successfully',
      data: deletedServiceDtl,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while deleting service configuration from system');
    return {
      status: 500,
      message: 'An error occurred while deleting service configuration from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { deleteService };
