'use strict';

import { logger, buildApiResponse } from 'finance-lib';
import controllers from '../../controllers/index.js';
import { COOKIE_OPTIONS } from '../../constants.js';

const log = logger('Router: login-user');
const userController = controllers.userController;

// API Function
const loginUser = async (req, res, next) => {
  try {
    log.info('Login user request operation initiated');
    const payload = req.body;

    log.info('Call controller function to check if the requested user exists or not');
    const userDetails = await userController.getUserInfoByUsernameOrEmail(payload.usernameEmail);
    if (!userDetails.isValid) {
      throw userDetails;
    }

    log.info('Call controller function to check if user is already verified or not');
    const verifiedUser = await userController.isVerifiedUser(userDetails);
    if (!verifiedUser.isValid) {
      throw verifiedUser;
    }

    log.info('Call controller function to validate user creds');
    const isCredsValid = await userController.verifyUserCreds(userDetails, payload.password);
    if (!isCredsValid.isValid) {
      throw isCredsValid;
    }

    log.info('Call controller function to grant access to user');
    const accessGranted = await userController.grantUserAccess(userDetails);
    if (!accessGranted.isValid) {
      throw accessGranted;
    }

    log.success('User login operation completed');
    res.status(200)
    .cookie('accessToken', accessGranted.data.accessToken, COOKIE_OPTIONS)
    .cookie('refreshToken', accessGranted.data.refreshToken, COOKIE_OPTIONS)
    .json(buildApiResponse(accessGranted));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default loginUser;
