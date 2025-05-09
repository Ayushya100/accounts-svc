'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { updateCategoryInfo } from '../../db/index.js';
import { getCategoryInfoById } from './getDashboardCategory.controller.js';

const log = logger('Controller: update-dashboard-setup');

const updateCategory = async (userId, categoryId, categoryDtl, payload) => {
  try {
    log.info('Controller function to update setup info initiated');
    userId = convertPrettyStringToId(userId);
    categoryId = convertPrettyStringToId(categoryId);

    payload.headerId = payload.headerId || categoryDtl.header.id;
    payload.categoryName = payload.categoryName || categoryDtl.categoryName;
    payload.userAllowed = payload.userAllowed || categoryDtl.userAllowed;
    payload.categoryType = payload.categoryType || categoryDtl.categoryType;
    payload.options = payload.options || categoryDtl.options;
    payload.value = payload.value || categoryDtl.value;

    payload.headerId = convertPrettyStringToId(payload.headerId);
    console.log(payload);

    log.info('Call db query to update dashboard setup description in system');
    await updateCategoryInfo(userId, categoryId, payload);
    let updatedCategoryDtl = await getCategoryInfoById(categoryId);
    updatedCategoryDtl = updatedCategoryDtl.data;

    log.success('Dashboard setup info updated successfully in system');
    return {
      status: 200,
      message: 'Dashboard setup updated successfully',
      data: updatedCategoryDtl,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while updating dashboard setup in system');
    return {
      status: 500,
      message: 'An error occurred while updating dashboard setup information',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { updateCategory };
