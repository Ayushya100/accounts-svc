'use strict';

import { _Error, convertPrettyStringToId, logger } from 'common-svc-lib';
import { AccountDB } from '../../db/index.js';

const log = logger('Controller: Update-User-Status');

const changeUserStatus = async (userId, userDtl) => {
  try {
    log.info('Controller operation to change User verification status initiated');
    userId = convertPrettyStringToId(userId);
    userDtl.is_deleted = !userDtl.is_deleted;

    log.info('Call db query to change the user status');
    await AccountDB.changeStatus(userId, userDtl.is_deleted);

    log.success('User verification status change has been completed successfully');
    return true;
  } catch (err) {
    log.error('An error occurred while changing the user verification status');
    throw _Error(500, 'An error occurred while changing the user status', err);
  }
};

export { changeUserStatus };
