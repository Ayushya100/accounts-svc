'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { isDashboardCategoryAvailable, registerNewCategory } from '../../db/index.js';
import { getCategoryInfoById } from './getDashboardCategory.controller.js';

const log = logger('Controller: register-dashboard-setup');

const verifyCategoryExist = async (categoryCd) => {
  try {
    log.info('Controller for validating dashboard setup controller activated');
    log.info('Call db query to validate if dashboard setup already exists');
    const categoryDtl = await isDashboardCategoryAvailable(categoryCd);
    if (categoryDtl.rowCount > 0) {
      log.error('Dashboard setup info already exists in system');
      return {
        status: 409,
        message: 'Dashboard setup info already exists',
        data: [],
        errors: [],
        stack: 'verifyCategoryExist function call',
        isValid: false,
      };
    }

    log.success('Dashboard setup verification completed successfully');
    return {
      status: 200,
      message: 'Dashboard setup verification completed',
      data: {},
      isValid: true,
    };
  } catch (err) {
    log.error('Error while validating new dashboard setup configuration in system');
    return {
      status: 500,
      message: 'An error occurred while validating dashboard setup in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const registerNewDashboardCategory = async (payload) => {
  try {
    log.info('Controller function to register new dashboard setup in system');
    payload.userAllowed = payload.userAllowed !== null && payload.userAllowed !== undefined ? payload.userAllowed : true;
    payload.headerId = convertPrettyStringToId(payload.headerId);

    log.info('Call db query to register new dashboard setup in system');
    const newDashboardInfo = await registerNewCategory(payload);
    const categoryId = newDashboardInfo.rows[0].id;

    const newCategoryDtl = await getCategoryInfoById(categoryId);

    log.success('New dashboard setup registered successfully in system');
    return {
      status: 201,
      message: 'New dashboard setup registered',
      data: newCategoryDtl.data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while registering new dashboard setup in system');
    return {
      status: 500,
      message: 'An error occurred while registering dashboard setup in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { verifyCategoryExist, registerNewDashboardCategory };
