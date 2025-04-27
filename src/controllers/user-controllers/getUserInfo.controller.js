'use strict';

import { logger, convertPrettyStringToId, convertIdToPrettyString, convertToNativeTimeZone } from 'finance-lib';
import { getUserInfo } from '../../db/index.js';

const log = logger('Controller: get-user-info');

const getUserInfoById = async (userId) => {
  try {
    log.info(`Controller for fetching user info for the requested user id: ${userId}`);

    log.info('Call db query to fetch user info by the id');
    userId = convertPrettyStringToId(userId);
    let userInfo = await getUserInfo(userId);
    if (userInfo.rowCount === 0) {
      log.error('No user found with the provided user id');
      return {
        status: 404,
        message: 'No user found with the provided user id.',
        data: userInfo.rows,
        errors: [],
        stack: 'getUserInfoById function call',
        isValid: false,
      };
    }

    userInfo = userInfo.rows[0];
    const user = {
      id: convertIdToPrettyString(userInfo.id),
      role: userInfo.role_cd,
      firstName: userInfo.first_name,
      lastName: userInfo.last_Name,
      username: userInfo.username,
      email: userInfo.email_id,
      loginType: userInfo.login_type,
      isEmailVerified: userInfo.is_verified,
      lastLogin: userInfo.last_login,
      loginCount: userInfo.login_count,
      createdDate: convertToNativeTimeZone(userInfo.created_date),
      modifiedDate: convertToNativeTimeZone(userInfo.modified_date),
    };

    log.success('User info for the requested user id fetched successfully.');
    return {
      status: 200,
      message: 'User Profile fetched successfully',
      data: user,
      isValid: true,
    };
  } catch (err) {
    log.error(`Error occurred while fetching user info for the requested user id.`);
    return {
      status: 500,
      message: 'An Error occurred while fetching user info for the requested user id.',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { getUserInfoById };
