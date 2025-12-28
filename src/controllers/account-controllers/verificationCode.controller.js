'use strict';

import { _Error, logger } from 'common-svc-lib';
import { v4 as uuidv4 } from 'uuid';
import { AccountDB } from '../../db/index.js';

const log = logger('Controller: verification-code');

const generateEmailVerificationCode = async (userId) => {
  try {
    log.info('Controller function to generate and register new verification code for user has been initiated');
    const verificationCode = uuidv4() + userId;
    const verificationExpiry = new Date(Date.now() + 6 * 60 * 60 * 1000);
    const verificationCodeRecords = await AccountDB.registerEmailVerification(userId, verificationCode, verificationExpiry);

    log.success('Verification code generated successfully');
    return true;
  } catch (err) {
    log.error('Error occurred while trying to generate the verification code for email verification');
    throw _Error(500, 'An error occurred while trying to generate the verification code', err);
  }
};

export { generateEmailVerificationCode };
