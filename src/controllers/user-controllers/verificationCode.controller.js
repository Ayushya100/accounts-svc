'use strict';

import { logger, sendMail } from 'finance-lib';
import { v4 as uuidv4 } from 'uuid';
import { registerEmailVerification } from '../../db/index.js';
import { serviceConfig } from '../../constants.js';

const log = logger('Controller: verification-code');

const generateEmailVerificationCode = async (userId) => {
  try {
    log.info('Controller function to generate and register new verification code for user has been initiated.');
    const verificationCode = uuidv4() + userId;
    const verificationExpiry = new Date(Date.now() + 6 * 60 * 60 * 1000);

    const verificationCodeRecord = await registerEmailVerification(userId, verificationCode, verificationExpiry);
    verificationCodeRecord['isValid'] = true;

    log.success('Verification code generated and stored successfully.');
    return verificationCodeRecord;
  } catch (err) {
    log.error('Error occurred while trying to generate the verification code for email verification.');
    return {
      status: 500,
      message: 'An Error occurred while trying to generate the verification code for email verification.',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const sendVerificationMailToUser = async (userInfo) => {
  log.info('Verification email send to user process initiated');
  let fullName = userInfo.firstName;
  if (userInfo.lastName) {
    fullName += ` ${userInfo.lastName}`;
  }

  const options = {
    name: fullName,
    userEmail: userInfo.email,
    link: `${serviceConfig.serviceName}/verify-user/${userInfo.id}/${userInfo.verification.verificationToken}`,
  };

  const emailResponse = await sendMail('VERIFY_MAIL', 'PLAIN', options);

  log.info('Verification email send completed');
  return emailResponse;
};

export { generateEmailVerificationCode, sendVerificationMailToUser };
