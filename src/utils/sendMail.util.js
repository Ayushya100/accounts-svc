'use strict';

import { logger, sendMail } from 'finance-lib';
import { serviceConfig } from '../constants.js';

const log = logger('util: send-mail');

const getFullName = (userInfo) => {
  let fullName = userInfo.firstName;
  if (userInfo.lastName) {
    fullName += ` ${userInfo.lastName}`;
  }
  return fullName;
};

const sendVerificationMailToUser = async (userInfo) => {
  log.info('Verification email send to user process initiated');
  let fullName = getFullName(userInfo);
  const options = {
    name: fullName,
    userEmail: userInfo.email,
    link: `${serviceConfig.serviceName}/api/v1.0/verify-user/${userInfo.id}/${userInfo.verification.verificationToken}`,
  };

  const emailResponse = await sendMail('VERIFY_MAIL', 'PLAIN', options);

  log.info('Verification email send completed');
  return emailResponse;
};

const sendVerificationConfirmationMailToUser = async (userInfo) => {
  log.info('Verfication confirmation email send to user process initiated');
  let fullName = getFullName(userInfo);
  const options = {
    name: fullName,
    userEmail: userInfo.email,
    tableData: userInfo.tableData,
  };

  const emailResponse = await sendMail('VERIFY_CONFIRM_MAIL', 'TABLE', options);

  log.info('Verification confirmation email send completed');
  return emailResponse;
};

export { sendVerificationMailToUser, sendVerificationConfirmationMailToUser };
