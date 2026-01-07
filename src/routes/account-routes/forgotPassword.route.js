'use strict';

import { _Error, _Response, logger, ResponseBuilder } from 'common-svc-lib';
import controllers from '../../controllers/index.js';
import { validateFields } from '../../utils/index.js';

const log = logger('Router: Forgot-Password');
const accountController = controllers.accountController;

// API Function
const forgotPassword = async (req, res, next) => {
  try {
    log.info('Forgot password operation initiated');
    const userIdentifier = req.body.userIdentifier;

    let validationResult = true;
    if (userIdentifier.includes('@')) {
      validationResult = validateFields({ email_id: userIdentifier }, ['email_id']);
    } else {
      validationResult = validateFields({ username: userIdentifier }, ['username']);
    }
    if (validationResult !== true) {
      log.error('Invalid user identifier provided');
      throw _Error(400, validationResult);
    }

    log.info('Call controller function to send forgot password link to user if valid');
    accountController.forgotPasswordRequest(userIdentifier, req.headers);

    log.success('Forgot password operation completed successfully');
    res.status(200).json(ResponseBuilder({ status: 200, message: 'Email has been sent to the registered email id', data: {} }));
  } catch (err) {
    log.error('Error occurred while processing the request');
    next(_Error(500, 'An error occurred while processing the request', err));
  }
};

export default forgotPassword;
