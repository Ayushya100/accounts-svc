'use strict';

import { logger, convertPrettyStringToId } from 'finance-lib';
import { logoutUser } from '../../db/index.js';

const log = logger('Controller: logout-user');

const logout = async (userId) => {
  try {
    log.info('Controller function to logout the user');
    log.info('Call db query to clear user token');
    await logoutUser(convertPrettyStringToId(userId));

    return {
      status: 200,
      message: 'User logged out',
      data: {},
      isValid: true,
    };
  } catch (err) {
    log.error('Error occurred while logging-out the user');
    return {
      status: 500,
      message: 'An Error occurred while user logout operation',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { logout };
