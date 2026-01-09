'use strict';

import { _Error, _Response, convertPrettyStringToId, formatResponseBody, logger } from 'common-svc-lib';
import { AccountDB } from '../../db/index.js';
import { fieldMappings } from '../../utils/index.js';

const log = logger('Controller: Get-User-Info');

const getUserInfoById = async (userId, inactive = false) => {
  try {
    log.info('Controller function to fetch the user details operation initiated');
    userId = convertPrettyStringToId(userId);

    log.info('Call db query to fetch requested user info');
    let userInfo = await AccountDB.getUserInfo(userId, inactive);
    if (userInfo.rowCount === 0) {
      log.error('No user found with the provided user id');
      throw _Error(404, 'No user found with the provided user id');
    }

    userInfo = userInfo.rows;
    formatResponseBody(userInfo, fieldMappings.userFields, ['role_id'], ['last_login']);
    userInfo = userInfo[0];
    log.success('Requested user info fetched successfully');
    return _Response(200, 'User found', userInfo);
  } catch (err) {
    log.error('Error occurred while fetching the user details for provided id');
    throw _Error(500, 'An error occurred while retrieving the user details', err);
  }
};

const getUserInfoByIdentity = async (userIdentity) => {
  try {
    log.info('Controller function to fetch the user details for provided identity operation initiated');
    log.info('Call db query to fetch user info');
    let userInfo = await AccountDB.userInfoByIdentity(userIdentity);
    if (userInfo.rowCount === 0) {
      log.error('No user found with the provided username or email id');
      throw _Error(404, 'No user found for the provided identity');
    }

    userInfo = userInfo.rows;
    formatResponseBody(userInfo, fieldMappings.userFields, ['role_id'], ['last_login']);
    userInfo = userInfo[0];
    log.success('Requested user info fetched successfully');
    return _Response(200, 'User found', userInfo);
  } catch (err) {
    log.error('Error occurred while fetching the user details for provided user identity');
    throw _Error(500, 'An error occurred while retrieving the user details', err);
  }
};

const getUserDetailInfoById = async (userId) => {
  try {
    log.info('Controller function to fetch the user details operation initiated');
    userId = convertPrettyStringToId(userId);

    log.info('Call db query to fetch the user details for the provided user id');
    let userInfo = await AccountDB.getUserDtlInfo(userId);
    if (userInfo.rowCount === 0) {
      log.error('No user available in system or soft-deleted for the requested id');
      throw _Error(404, 'Requested user does not exists');
    }

    userInfo = userInfo.rows;
    formatResponseBody(userInfo, fieldMappings.userFields, ['role_id'], ['last_login']);
    userInfo = userInfo[0];

    log.success('User info retrieved successfully');
    return _Response(200, 'User Profile fetched successfully', userInfo);
  } catch (err) {
    log.error('Error occurred while fetching the user details');
    throw _Error(500, 'An error occurred while retrieving the user details', err);
  }
};

export { getUserInfoById, getUserInfoByIdentity, getUserDetailInfoById };
