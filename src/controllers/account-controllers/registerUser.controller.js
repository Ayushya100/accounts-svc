'use strict';

import bcrypt from 'bcrypt';
import { _Error, _Response, logger } from 'common-svc-lib';
import { SystemDB, AccountDB } from '../../db/index.js';
import { SALT_ROUNDS } from '../../constants.js';
import { getUserInfoById } from './getUserInfo.controller.js';
import { generateEmailVerificationCode } from './verificationCode.controller.js';

const log = logger('Controller: register-user');

const verifyUsernameEmailAlreadyTaken = async (payload) => {
  try {
    log.info('Controller function to validate if the username or email available to use process initiated');
    log.info('Call db query to check if username and email available to use');
    const data = await AccountDB.isUsernameEmailInUse(payload.username, payload.email_id);

    if (data.rowCount > 0) {
      log.error('Username or Email id already taken by another user. Cannot proceed further!');
      throw _Error(409, 'Username or email id provided is already taken');
    }

    log.success('Username and Email Id provided are valid to be used for registering new user');
    return true;
  } catch (err) {
    log.error('Error while validating if username or email already taken!');
    throw _Error(500, 'An error occurred while validating if the username or email already taken', err);
  }
};

const registerNewUser = async (payload) => {
  try {
    log.info('Controller function to register new user in system initiated');
    let defaultUserRole = await SystemDB.getDefaultUserRole();
    if (defaultUserRole.rowCount === 0) {
      throw _Error(404, 'No user role found. Cannot proceed further');
    }

    defaultUserRole = defaultUserRole.rows[0].id;
    const encryptPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);
    payload.first_name = payload.first_name.trim();
    payload.last_name = payload.last_name ? payload.last_name.trim() : null;
    payload.username = payload.username.trim();
    payload.email_id = payload.email_id.trim();
    payload.password = encryptPassword;
    payload.role_id = defaultUserRole;
    payload.login_type = 'EMAIL_PASSWORD';

    log.info('Call db query to register new user in system');
    const newUser = await AccountDB.registerNewUser(payload);
    const newUserId = newUser.rows[0].id;

    const newUserDtl = await getUserInfoById(newUserId);
    await generateEmailVerificationCode(newUserId);

    log.success('New user registered successfully in system');
    return _Response(201, 'User registered successfully', newUserDtl.data);
  } catch (err) {
    log.error('Error while registering new user in system');
    throw _Error(500, 'An error occurred while registering new user in system', err);
  }
};

export { verifyUsernameEmailAlreadyTaken, registerNewUser };
