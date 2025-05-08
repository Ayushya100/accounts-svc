'use strict';

import { convertIdToPrettyString, convertPrettyStringToId, logger } from 'common-node-lib';
import { getCategoryById } from '../../db/index.js';

const log = logger('Controller: get-dashboard-category');

const getCategoryInfoById = async (categoryId, deletedRecord = false) => {
  try {
    log.info('Controller function to fetch dashboard category info by id process initiated');
    categoryId = convertPrettyStringToId(categoryId);

    log.info(`Call db query to fetch the dashboard category details for provided id: ${categoryId}`);
    let categoryDtl = await getCategoryById(categoryId, deletedRecord);
    if (categoryDtl.rowCount === 0) {
      log.error('Header category info for provided id does not exists in system');
      return {
        status: 404,
        message: 'Dashboard category not found',
        data: [],
        errors: [],
        stack: 'getCategoryInfoById function call',
        isValid: false,
      };
    }

    categoryDtl = categoryDtl.rows[0];
    categoryDtl = {
      id: convertIdToPrettyString(categoryDtl.id),
      categoryCode: categoryDtl.category_cd,
      categoryName: categoryDtl.category_name,
      userAllowed: categoryDtl.user_applicable,
      categoryType: categoryDtl.category_type,
      options: categoryDtl.options,
      value: categoryDtl.value,
      core: categoryDtl.core,
      header: {
        id: convertIdToPrettyString(categoryDtl.header_id),
        headerCode: categoryDtl.header_cd,
        headerDesc: categoryDtl.header_desc,
      },
    };

    log.success('Requested category details fetched successfully');
    return {
      status: 200,
      message: 'Dashboard category details fetched successfully',
      data: categoryDtl,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while fetching header category for requested id from system');
    return {
      status: 500,
      message: 'An error occurred while fetching dashboard category for requested id from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { getCategoryInfoById };
