'use strict';

import { convertIdToPrettyString, convertPrettyStringToId, convertToNativeTimeZone, logger } from 'common-node-lib';
import { getHeaderById } from '../../db/index.js';

const log = logger('Controller: get-dashboard-header');

const getHeaderInfoById = async (headerId, deletedRecord = false) => {
  try {
    log.info('Controller function to fetch dashboard header info by id process initiated');
    headerId = convertPrettyStringToId(headerId);

    log.info(`Call db query to fetch the dashboard header details for provided id: ${headerId}`);
    let headerDtl = await getHeaderById(headerId, deletedRecord);
    if (headerDtl.rowCount === 0) {
      log.error('Header info for the provided id does not exists in system');
      return {
        status: 404,
        message: 'Dashboard header not found',
        data: [],
        errors: [],
        stack: 'getHeaderInfoById function call',
        isValid: false,
      };
    }

    headerDtl = headerDtl.rows[0];
    headerDtl = {
      id: convertIdToPrettyString(headerDtl.id),
      headerCode: headerDtl.header_cd,
      headerDesc: headerDtl.header_desc,
      active: headerDtl.is_active,
      createdDate: convertToNativeTimeZone(headerDtl.created_date),
      modifiedDate: convertToNativeTimeZone(headerDtl.modified_date),
    };

    log.success('Requested header details fetched successfully');
    return {
      status: 200,
      message: 'Dashboard Header fetched successfully',
      data: headerDtl,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while fetching header info for requested id from system');
    return {
      status: 500,
      message: 'An error occurred while fetching dashboard info for requested id from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { getHeaderInfoById };
