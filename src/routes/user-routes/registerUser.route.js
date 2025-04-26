'use strict';

import { logger, buildApiResponse } from 'finance-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: register-user');
const userController = controllers.userController;

// API Function
const registerUser = async (req, res, next) => {
  try {
    log.info('Register user request operation initiated!');

    const payload = req.body;

    log.info('Call controller function to check if the requested username and email id available to use or already taken.');
    const isEmailIdUsernameValid = await userController.verifyUsernameEmailAlreadyTaken({
      username: payload.username,
      emailId: payload.emailId,
    });

    if (!isEmailIdUsernameValid.isValid) {
      throw isEmailIdUsernameValid;
    }

    log.info('Call controller function to create a new user in a system.');
    const newUser = await userController.registerNewUser(payload);

    if (!newUser.isValid) {
      throw newUser;
    }

    log.success('New user registered successfully!');
    res.status(201).json(buildApiResponse(newUser));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default registerUser;
