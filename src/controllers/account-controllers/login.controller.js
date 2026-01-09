'use strict';

import bcrypt from 'bcrypt';
import { logger, _Error, formatResponseBody, convertPrettyStringToId, convertToNativeTimezone, _Response } from 'common-svc-lib';
import { AccountDB, SystemDB } from '../../db/index.js';
import { generateEmailVerificationCode } from './verificationCode.controller.js';
import { generateUserAccessToken, generateUserRefreshToken } from '../../utils/generateTokens.js';

const log = logger('Controller: Login');

const grantUserAccess = async (userInfo) => {
  try {
    log.info('Controller operation to grant user login access initiated');
    const userId = convertPrettyStringToId(userInfo.id);
    const roleId = convertPrettyStringToId(userInfo.role_id);

    log.info('Call db query to fetch user assigned scopes based on the role id');
    let userScopes = await SystemDB.getUserScope(roleId);
    if (userScopes.rowCount === 0) {
      userInfo['scopes'] = [];
    } else {
      userInfo['scopes'] = userScopes.rows.map((scope) => scope.scope_cd);
    }

    userInfo['access_token'] = await generateUserAccessToken(userInfo);
    userInfo['refresh_token'] = await generateUserRefreshToken(userInfo);

    let currentLoginTime = new Date(Date.now());
    currentLoginTime = convertToNativeTimezone(currentLoginTime);

    log.info('Call db query to update user login info');
    await AccountDB.storeUserLoginInfo(userId, userInfo.refresh_token, currentLoginTime);
    return;
  } catch (err) {
    log.error('Error occurred while granting access to the user');
    throw _Error(500, 'An error occurred while granting access to the user', err);
  }
};

const loginUserVerification = async (userDtl, userPassword, headers) => {
  try {
    log.info('Controller operation to grant access to the user operation initiated');
    const userId = convertPrettyStringToId(userDtl.id);

    if (!userDtl.is_verified) {
      log.error('User not yet verified - sending new verification mail');
      await generateEmailVerificationCode(userId, userDtl, headers);
      throw _Error(400, 'Account not yet verified');
    }

    log.info('Verify user creds');
    let storedPassKey = await AccountDB.getUserPassKey(userId);
    storedPassKey = storedPassKey.rows[0].password;
    const isPassKeyValid = await bcrypt.compare(userPassword, storedPassKey);

    if (!isPassKeyValid) {
      log.error('Invalid credentials. Cannot proceed further!');
      throw _Error(400, 'Invalid Credentials');
    }

    if (userDtl.is_deleted) {
      log.info('Reactivate the inactive user');
      await AccountDB.changeStatus(userId, false);
      userDtl.is_deleted = false;
    }

    await grantUserAccess(userDtl);
    log.success('Access granted to user successfully');
    return _Response(200, 'User login successful', userDtl);
  } catch (err) {
    log.error('An error occured while performing login operation and user verification');
    throw _Error(500, 'Error occured while granting access to the user', err);
  }
};

export { loginUserVerification, grantUserAccess };
