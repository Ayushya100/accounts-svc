'use strict';

import { _Error, _Response, convertPrettyStringToId, logger } from 'common-svc-lib';
import { AccountDB } from '../../db/index.js';

const log = logger('Controller: Logout-User');

const logout = async (userId) => {
  try {
    log.info('Controller operation to logout the requested user initiated');
    userId = convertPrettyStringToId(userId);

    log.info('Call db query to delete user active key');
    await AccountDB.logoutUser(userId);

    return _Response(200, 'User logout');
  } catch (err) {
    log.error('Error occurred while performing user logout operation');
    throw _Error(500, 'An error occurred while performing user logout operation', err);
  }
};

export { logout };
