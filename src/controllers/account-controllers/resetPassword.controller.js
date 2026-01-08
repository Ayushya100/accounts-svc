'use strict';

import { _Error, _Response, convertPrettyStringToId, logger } from 'common-svc-lib';
import bcrypt from 'bcrypt';
import { AccountDB } from '../../db/index.js';
import { SALT_ROUNDS } from '../../constants.js';
import { generatePasswordResetConfirmation } from './verificationCode.controller.js';

const log = logger('Controller: Reset-Password');

const validateUserPasswordToken = async (userId, token) => {
  try {
    log.info('Controller operation for User verification with the token initiated');
    userId = convertPrettyStringToId(userId);

    log.info('Call db query to fetch user details');
    let userInfo = await AccountDB.getUserMetaInfo(userId);
    if (userInfo.rowCount === 0) {
      log.error('No user metadata info found');
      throw _Error(400, 'User record not found');
    }
    userInfo = userInfo.rows[0];

    const currentTime = new Date(Date.now());
    if (token !== userInfo.forgot_password_token || currentTime > userInfo.forgot_password_token_exp) {
      log.error('Invalid or Expired Token');
      throw _Error(400, 'Invalid or Expired Token');
    }

    log.success('User information fetched successfully based on basic verification');
    return _Response(200, 'User details found', userInfo);
  } catch (err) {
    log.error('An error occurred while validating user with token');
    throw _Error(500, 'An error occurred while performing basic user verification', err);
  }
};

const resetPassword = async (userId, userDtl, password, headers) => {
  try {
    log.info('Controller operation to update the password for the user operation initiated');
    userId = convertPrettyStringToId(userId);

    log.info('Call db query to fetch user current passkey');
    let userRecord = await AccountDB.getUserPassKey(userId);
    userRecord = userRecord.rows[0];
    const storedPassKey = userRecord.password;

    const isPassKeyValid = await bcrypt.compare(password, storedPassKey);
    if (isPassKeyValid) {
      log.error('New password cannot be same as old password');
      throw _Error(400, 'New Password cannot be same as old');
    }

    const encryptPassword = await bcrypt.hash(password, SALT_ROUNDS);
    log.info('Call DB query to update user password');
    await AccountDB.updateUserPassword(userId, encryptPassword);

    const currentTime = new Date(Date.now());
    log.info('Call db query to update password expiry time to current time');
    await AccountDB.passwordVerification(userId, null, currentTime);

    await generatePasswordResetConfirmation(userId, userDtl, headers);

    log.success('Password Reset operation completed successfully');
    return _Response(200, 'Password Reset successfully');
  } catch (err) {
    log.error('An error occurred while updating the password for the user');
    throw _Error(500, 'An error occurred while updating the password for the user', err);
  }
};

const updatePassword = async (userId, userDtl, payload, headers) => {
  try {
    log.info('Controller operation to update the password for the user operation initiated');
    const oldPassword = payload.old_password;
    const newPassword = payload.new_password;
    userId = convertPrettyStringToId(userId);

    if (newPassword === oldPassword) {
      log.error('New Password cannot be same as old password');
      throw _Error(400, 'New Password cannot be same as old');
    }

    log.info('Call db query to fetch user current passkey');
    let userRecord = await AccountDB.getUserPassKey(userId);
    userRecord = userRecord.rows[0];
    const storedPassKey = userRecord.password;

    const isPassKeyValid = await bcrypt.compare(oldPassword, storedPassKey);
    if (!isPassKeyValid) {
      log.error('Invalid credentials. Cannot proceed further!');
      throw _Error(400, 'Invalid Credentials');
    }

    const encryptPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    log.info('Call DB query to update user password');
    await AccountDB.updateUserPassword(userId, encryptPassword);

    await generatePasswordResetConfirmation(userId, userDtl, headers);

    log.success('Password Reset operation completed successfully');
    return _Response(200, 'Password Reset successfully');
  } catch (err) {
    log.error('An error occurred while updating the password for the user');
    throw _Error(500, 'An error occurred while updating the password for the user', err);
  }
};

export { validateUserPasswordToken, resetPassword, updatePassword };
