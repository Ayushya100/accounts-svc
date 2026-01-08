'use strict';

import { _Error, _Response, formatResponseBody, logger } from 'common-svc-lib';
import { AccountDB } from '../../db/index.js';
import { fieldMappings } from '../../utils/index.js';

const log = logger('Controller: Get-All-Users');

const getAllUsersList = async () => {
  try {
    log.info('Controller function to fetch the list of users operation initiated');

    log.info('Call db query to fetch list of users');
    let userDtl = await AccountDB.getAllusers();
    if (userDtl.rowCount === 0) {
      log.info('No user found');
      return _Response(204, 'No user found');
    }

    userDtl = userDtl.rows;
    formatResponseBody(userDtl, fieldMappings.userFields, [], ['last_login']);

    log.success('Users list from system operation completed successfully');
    return _Response(200, 'Users found', userDtl);
  } catch (err) {
    log.info('An error occurred while fetching the list of users from system for admin');
    throw _Error(500, 'An error occurred while fetching the list of users from system', err);
  }
};

export { getAllUsersList };
