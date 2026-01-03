'use strict';

import { _Error, _Response, convertPrettyStringToId, logger } from 'common-svc-lib';
import { AccountDB } from '../../db/index.js';
import { generateEmailVerificationCode } from './verificationCode.controller.js';
import { requestEmailSend } from '../../utils/index.js';

const log = logger('Controller: verify-user');

const sendVerificationConfirmationMail = (userId, userDtl, headers) => {
  const userPayload = {
    to: userDtl.email_id,
    template: 'VERIFICATION_CONFIRM_MAIL',
    data: {
      id: userId,
      role_code: userDtl.role_code,
      first_name: userDtl.first_name,
      last_name: userDtl.last_name,
      username: userDtl.username,
      email_id: userDtl.email_id,
      is_verified: true,
      login_type: userDtl.login_type
    }
  };
  const userContext = {
    userId: userId,
    sessionId: headers['x-session-id'],
    correlationId: headers['x-correlation-id']
  };

  requestEmailSend(userPayload, userContext);

  log.success('Verification confirmation mail task submitted successfully');
}

const verifyUserToken = async (userId, token, userData, headers) => {
  try {
    log.info('Controller function to verify the user with the provided token operation initiated');
    userId = convertPrettyStringToId(userId);

    log.info('Call db query to fetch user metadata info');
    let userMetaInfo = await AccountDB.getUserMetaInfo(userId);
    if (userMetaInfo.rowCount === 0) {
      log.error('No user metadata found for the provided user id');
      throw _Error(404, 'No user meta info found for the provided id');
    }

    userMetaInfo = userMetaInfo.rows[0];
    if (userMetaInfo.verification_token !== token) {
      log.error('User verification token invalid');
      throw _Error(400, 'User email verification code invalid');
    }

    const currentTime = new Date(Date.now());
    if (currentTime > userMetaInfo.verification_token_exp) {
      log.error('Verification token has been expired');
      await generateEmailVerificationCode(userId, userData, headers);
      throw _Error(410, 'Verification code has been expired. New code will be send for verification');
    }

    log.info('Call db query to verify user');
    let emailVerificationResult = await AccountDB.verifyUserEmail(userId, currentTime);

    sendVerificationConfirmationMail(userId, userData, headers);

    log.success('User email has been verified successfully');
    return _Response(200, 'Email is verified', {
      email_verified: emailVerificationResult,
    });
  } catch (err) {
    log.error('An error occurred while verifying the user email id via the provided token.');
    throw _Error(500, 'An error occurred while verifying the user email id', err);
  }
};

export { verifyUserToken };
