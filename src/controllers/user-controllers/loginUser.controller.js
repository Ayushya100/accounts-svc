'use strict';

import bcrypt from 'bcrypt';
import { logger, convertPrettyStringToId, convertToNativeTimeZone } from 'common-node-lib';
import { generateEmailVerificationCode } from './verificationCode.controller.js';
import { sendVerificationMailToUser } from '../../utils/index.js';
import { getUserPasskey, storeUserToken } from '../../db/index.js';
import { generateUserAccessToken, generateUserRefreshToken } from '../../utils/index.js';

const log = logger('Controller: login-user');

const isVerifiedUser = async (userInfo) => {
  try {
    log.info('Controller function to check if user verified and resend new token initiated');
    const isUserVerified = userInfo.data.user.isEmailVerified;
    const userId = convertPrettyStringToId(userInfo.data.user.id);

    if (!isUserVerified) {
      log.error('User not yet verified - sending new verification mail');
      const verificationCodeGenerated = await generateEmailVerificationCode(userId);

      let message = 'User not verified';
      const resData = {
        ...userInfo.data.user,
      };
      if (!verificationCodeGenerated.isValid) {
        message += '. Failed to generate the verification code. Try logging in after sometime';
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
          message += '. New verification mail has been sent to your email id.';
        }
      }

      return {
        status: 410,
        message: message,
        data: [resData],
        errors: [],
        stack: 'isVerifiedUser function call',
        isValid: false,
      };
    }

    log.success('User is a verified user');
    return {
      status: 200,
      message: 'User is verified',
      data: userInfo.data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error occurred while validating user verification and resend new token');
    return {
      status: 500,
      message: 'An Error occurred while checking user validity',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const verifyUserCreds = async (userInfo, password) => {
  try {
    log.info('Process to verify user credentials initiated');
    const userId = convertPrettyStringToId(userInfo.data.user.id);

    let storedPasskey = await getUserPasskey(userId);
    storedPasskey = storedPasskey.rows[0].password;
    const isPasskeyCorrect = await bcrypt.compare(password, storedPasskey);

    if (!isPasskeyCorrect) {
      log.error('Invalid credentials cannot provide access');
      return {
        status: 400,
        message: 'Credentials invalid',
        data: [],
        errors: [],
        stack: 'verifyUserCreds function call',
        isValid: false,
      };
    }

    log.success('Credentials verified successfully');
    return {
      status: 200,
      message: 'Credentials verified',
      data: userInfo.data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error occurred while validating user credentials');
    return {
      status: 500,
      message: 'An Error occurred while verifying user',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const grantUserAccess = async (userInfo) => {
  try {
    log.info('Access grant operation initiated');
    const userData = userInfo.data;
    userData.accessToken = await generateUserAccessToken(userData.user);
    userData.refreshToken = await generateUserRefreshToken(userData.user);

    const userId = convertPrettyStringToId(userData.user.id);
    let currentLoginTime = new Date(Date.now());
    currentLoginTime = convertToNativeTimeZone(currentLoginTime);

    log.info('Call db query to update required info');
    await storeUserToken(userId, userData.refreshToken, currentLoginTime);

    return {
      status: 200,
      message: 'User logged in successfully',
      data: userData,
      isValid: true,
    };
  } catch (err) {
    log.error('Error occurred while granting access to the user');
    return {
      status: 500,
      message: 'An Error occurred while granting access to the user',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { isVerifiedUser, verifyUserCreds, grantUserAccess };
