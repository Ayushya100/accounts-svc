'use strict';

import { logger } from 'common-node-lib';
import { isDashboardCategoryAvailable } from '../../db/index.js';

const log = logger('Controller: register-dashboard-category');

const verifyCategoryExist = async (categoryCd) => {
  try {
    log.info('Controller for validating dashboard category controller activated');
    log.info('Call db query to validate if dashboard category already exists');
    const categoryDtl = await isDashboardCategoryAvailable(categoryCd);
    if (categoryDtl.rowCount > 0) {
      log.error('Dashboard category info already exists in system');
      return {
        status: 409,
        message: 'Dashboard category info already exists',
        data: [],
        errors: [],
        stack: 'verifyCategoryExist function call',
        isValid: false,
      };
    }

    log.success('Dashboard category verification completed successfully');
    return {
      status: 200,
      message: 'Dashboard category verification completed',
      data: {},
      isValid: true,
    };
  } catch (err) {
    log.error('Error while validating new dashboard category configuration in system');
    return {
      status: 500,
      message: 'An error occurred while validating dashboard category in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { verifyCategoryExist };
