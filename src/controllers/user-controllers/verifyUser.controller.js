'use strict';

import { logger, convertPrettyStringToId, convertToNativeTimeZone } from 'finance-lib';
import { fetchUserMetaInfo, verifyUserEmail } from '../../db/index.js';
import { generateEmailVerificationCode } from './verificationCode.controller.js';
import { sendVerificationMailToUser, sendVerificationConfirmationMailToUser } from '../../utils/index.js';

const log = logger('Controller: verify-user');

const verifyUserToken = async (userId, token, userInfo) => {
  try {
    log.info('Controller function to verify the user with the provided token initiated');
    userId = convertPrettyStringToId(userId);

    log.info('Call db query to fetch user meta info.');
    let userMetaInfo = await fetchUserMetaInfo(userId);
    if (userMetaInfo.rowCount === 0) {
      log.error('No user meta info found for the provided user id');
      return {
        status: 404,
        message: 'No user meta info found for the provided user id.',
        data: userMetaInfo.rows,
        errors: [],
        stack: 'verifyUser function call',
        isValid: false,
      };
    }

    userMetaInfo = userMetaInfo.rows[0];
    if (userMetaInfo.verification_token !== token) {
      log.error('User verification token invalid');
      return {
        status: 400,
        message: 'User email verification code invalid',
        data: userMetaInfo.rows,
        errors: [],
        stack: 'verifyUser function call',
        isValid: false,
      };
    }

    let message = '';
    const currentTime = new Date(Date.now());
    if (currentTime > userMetaInfo.verification_token_exp) {
      log.error('Verification token has been expired');
      const verificationCodeGenerated = await generateEmailVerificationCode(userId);

      message = 'Verification token has been expired';
      const resData = {
        ...userInfo,
      };
      if (!verificationCodeGenerated.isValid) {
        message += '. Failed to generate the verification code. Try logging in to verify your email';
        resData['verification'] = {};
      } else {
        resData['verification'] = {
          verificationToken: verificationCodeGenerated.rows[0].verification_token,
          verificationTokenExp: convertToNativeTimeZone(verificationCodeGenerated.rows[0].verification_token_exp),
        };

        const emailResponse = await sendVerificationMailToUser(resData);
        if (!emailResponse.emailStatus) {
          message += '. Failed to send the verification mail. Kindly try to login after sometime.';
        } else {
          message += ' and new verification email has been sent to your email id.';
        }
      }

      return {
        status: 410,
        message: message,
        data: [resData],
        errors: [],
        stack: 'verifyUser function call',
        isValid: false,
      };
    }

    log.info('Complete user verification');
    let isEmailVerified = await verifyUserEmail(userId);
    isEmailVerified = isEmailVerified.rows[0];

    const emailData = {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      tableData: [
        {
          name: 'First Name',
          description: userInfo.firstName,
        },
        {
          name: 'Last Name',
          description: userInfo.lastName || 'No data provided',
        },
        {
          name: 'Username',
          description: userInfo.username,
        },
        {
          name: 'Registered Email Id',
          description: userInfo.email,
        },
        {
          name: 'Account Creation Date',
          description: userInfo.createdDate.split(' ')[0],
        },
        {
          name: 'Account Verified',
          description: 'Yes',
        },
      ],
    };

    await sendVerificationConfirmationMailToUser(emailData);

    log.success('User email has been verified successfully.');
    return {
      status: 200,
      message: 'Email is verified',
      data: {
        isEmailVerified: isEmailVerified.is_verified,
      },
      isValid: true,
    };
  } catch (err) {
    log.error(`Error occurred while verifying the user email id via the provided token.`);
    return {
      status: 500,
      message: 'An Error occurred while verifying the user email id via the provided token.',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { verifyUserToken };
