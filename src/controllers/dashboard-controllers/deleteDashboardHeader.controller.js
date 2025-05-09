'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { setupByHeaderId, deleteHeaderById } from '../../db/index.js';
import { getHeaderInfoById } from './getDashboardHeader.controller.js';

const log = logger('Controller: delete-dashboard-header');

const deleteHeader = async (userId, headerId, headerDtl) => {
  try {
    log.info('Controller function to delete dashboard header from system process initiated');
    headerId = convertPrettyStringToId(headerId);
    userId = convertPrettyStringToId(userId);

    if (headerDtl.core) {
      log.error('Cannot delete the core dashboard header');
      return {
        status: 400,
        message: 'Core dashboard header cannot be deleted',
        data: [],
        errors: [],
        stack: 'deleteHeader function call',
        isValid: false,
      };
    }

    log.info('Call db query to check if any setup assigned to the header');
    const setupRecords = await setupByHeaderId(headerId);
    if (setupRecords.rowCount > 0) {
      log.error('Cannot delete dashboard headers with setup assigned');
      return {
        status: 400,
        message: 'Dashboard header with assigned setups cannot be deleted',
        data: [],
        errors: [],
        stack: 'deleteHeader function call',
        isValid: false,
      };
    }

    log.info('Call db query to soft delete the dashboard header from system');
    await deleteHeaderById(userId, headerId);
    let deletedHeaderDtl = await getHeaderInfoById(headerId, true);
    deletedHeaderDtl = deletedHeaderDtl.data;

    log.success('Dashboard header deletion operation completed successfully');
    return {
      status: 200,
      message: 'Dashboard header info deleted successfully',
      data: deletedHeaderDtl,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while deleting header from system');
    return {
      status: 500,
      message: 'An error occurred while deleting header from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { deleteHeader };
