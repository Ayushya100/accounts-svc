'use strict';

import { _Error, logger } from 'common-svc-lib';
import { v4 as uuidv4 } from 'uuid';
import { AccountDB } from '../../db/index.js';
import { requestEmailSend } from '../../utils/index.js';

const log = logger('Controller: Verification-Code');

const generateEmailVerificationCode = async (userId, userDtl, headers) => {
  try {
    log.info('Controller function to generate and register new verification code for user has been initiated');
    const verificationCode = uuidv4() + userId;
    const verificationExpiry = new Date(Date.now() + 6 * 60 * 60 * 1000);
    const verificationCodeRecords = await AccountDB.registerEmailVerification(userId, verificationCode, verificationExpiry);

    const userPayload = {
      to: userDtl.email_id,
      template: 'USER_VERIFICATION_MAIL',
      data: {
        id: userId,
        role_code: userDtl.role_code,
        first_name: userDtl.first_name,
        last_name: userDtl.last_name,
        username: userDtl.username,
        email_id: userDtl.email_id,
        is_verified: userDtl.is_verified,
        login_type: userDtl.login_type,
        verification_code: verificationCode,
        verification_code_exp: verificationExpiry,
      },
    };
    const userContext = {
      userId: userId,
      sessionId: headers['x-session-id'],
      correlationId: headers['x-correlation-id'],
    };

    requestEmailSend(userPayload, userContext);

    log.success('Verification code generated successfully');
    return true;
  } catch (err) {
    log.error('Error occurred while trying to generate the verification code for email verification');
    throw _Error(500, 'An error occurred while trying to generate the verification code', err);
  }
};

export { generateEmailVerificationCode };
