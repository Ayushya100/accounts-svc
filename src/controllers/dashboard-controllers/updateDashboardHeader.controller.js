'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { updateHeaderInfo } from '../../db/index.js';
import { getHeaderInfoById } from './getDashboardHeader.controller.js';

const log = logger('Controller: update-dashboard-header');

const updateHeader = async (userId, headerId, headerDtl, payload) => {
  try {
    log.info('Controller function to update header info initiated');
    userId = convertPrettyStringToId(userId);
    headerId = convertPrettyStringToId(headerId);
    payload.headerDesc = payload.headerDesc || headerDtl.headerDesc;

    log.info('Call db query to update dashboard header description in system');
    await updateHeaderInfo(userId, headerId, payload);
    let updatedHeaderDtl = await getHeaderInfoById(headerId);
    updatedHeaderDtl = updatedHeaderDtl.data;

    log.success('Dashboard header info updated successfully in system');
    return {
      status: 200,
      message: 'Dashboard header updated successfully',
      data: updatedHeaderDtl,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while updating dashboard header in system');
    return {
      status: 500,
      message: 'An error occurred while updating dashboard header information',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { updateHeader };
