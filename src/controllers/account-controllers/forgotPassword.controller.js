'use strict';

import { _Error, logger } from 'common-svc-lib';
import { AccountDB } from '../../db/index.js';
import { getUserInfoById } from './getUserInfo.controller.js';
import { generatePasswordVerificationCode } from './verificationCode.controller.js';

const log = logger('Controller: Forgot-Password');

const forgotPasswordRequest = async (userIdentifier, headers) => {
  try {
    log.info('Controller function to generate password reset token process initiated');
    const data = await AccountDB.isUsernameEmailInUse(userIdentifier, userIdentifier);
    if (data.rowCount === 0) {
      log.error('No user for the provided identifier found');
    }
    const userId = data.rows[0].id;

    log.info('Fetch user details by user id');
    let userDtl = await getUserInfoById(userId);
    userDtl = userDtl.data;
    await generatePasswordVerificationCode(userId, userDtl, headers);

    log.success('User password reset token sent successfully');
    return true;
  } catch (err) {
    log.error('Error occurred while generating the password reset token for the user');
  }
};

export { forgotPasswordRequest };
