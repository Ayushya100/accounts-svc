'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { deleteCategoryById } from '../../db/index.js';
import { getCategoryInfoById } from './getDashboardCategory.controller.js';

const log = logger('Controller: delete-dashboard-setup');

const deleteHeaderCategory = async (userId, categoryId, headerDtl) => {
  try {
    log.info('Controller function to delete header configuration from system process initiated');
    categoryId = convertPrettyStringToId(categoryId);
    userId = convertPrettyStringToId(userId);

    if (headerDtl.core) {
      log.error('Cannot delete the core header setup');
      return {
        status: 400,
        message: 'Core header setup cannot be deleted',
        data: [],
        errors: [],
        stack: 'deleteHeaderCategory function call',
        isValid: false,
      };
    }

    log.info('Call db query to soft delete the header setup from system');
    await deleteCategoryById(userId, categoryId);
    let deletedCategoryDtl = await getCategoryInfoById(categoryId, true);
    deletedCategoryDtl = deletedCategoryDtl.data;

    log.success('Dashboard setup deletion operation completed successfully');
    return {
      status: 200,
      message: 'Dashboard setup info deleted successfully',
      data: deletedCategoryDtl,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while deleting header setup from system');
    return {
      status: 500,
      message: 'An error occurred while deleting header setup from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { deleteHeaderCategory };
