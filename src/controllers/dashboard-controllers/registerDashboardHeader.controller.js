'use strict';

import { logger } from 'common-node-lib';
import { isDashboardHeaderAvailable, registerNewHeader } from '../../db/index.js';
import { getHeaderInfoById } from './getDashboardHeader.controller.js';

const log = logger('Controller: register-dashboard-header');

const verifyHeaderExist = async (payload) => {
  try {
    log.info('Controller for validating dashboard header controller activated');
    log.info('Call db query to validate if dashboard header already exists');
    const headerDtl = await isDashboardHeaderAvailable(payload.headerCode);
    if (headerDtl.rowCount > 0) {
      log.error('Dashboard header info already exists in system');
      return {
        status: 409,
        message: 'Dashboard header info already exists',
        data: [],
        errors: [],
        stack: 'verifyHeaderExist function call',
        isValid: false,
      };
    }

    log.success('Dashboard header verification completed successfully');
    return {
      status: 200,
      message: 'Dashboard header verification completed',
      data: {},
      isValid: true,
    };
  } catch (err) {
    log.error('Error while validating new dashboard configuration in system');
    return {
      status: 500,
      message: 'An error occurred while validating dashboard config in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const registerNewDashboardHeader = async (payload) => {
  try {
    log.info('Controller function to register new dashboard header in system activated');
    log.info('Call db query to register new dashboard header in system');
    const newDashboardInfo = await registerNewHeader(payload);
    const headerId = newDashboardInfo.rows[0].id;

    const newHeaderDtl = await getHeaderInfoById(headerId);

    log.success('New dashboard header registered successfully in system');
    return {
      status: 201,
      message: 'New dashboard header registered',
      data: newHeaderDtl.data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while registering new dashboard header in system');
    return {
      status: 500,
      message: 'An error occurred while registering dashboard header in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { verifyHeaderExist, registerNewDashboardHeader };
