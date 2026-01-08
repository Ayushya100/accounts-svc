'use strict';

import { _Error, logger, ResponseBuilder } from 'common-svc-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: Reset-Password');
const accountController = controllers.accountController;

// API Function
const requestResetPassword = async (req, res, next) => {
  try {
    log.info('Request reset password operation initiated');
    const { userId, token, password } = req.body;

    log.info('Call controller function to verify if requested user exists');
    const userDtl = await accountController.getUserInfoById(userId);

    log.info('Call controller function to verify the user with the token and validity');
    await accountController.validateUserPasswordToken(userId, token);

    log.info('Call controller function to update the user password');
    await accountController.resetPassword(userId, userDtl.data, password, req.headers);

    log.success('Request Reset Password operation completed successfully');
    res.status(200).json(ResponseBuilder({ status: 200, message: 'Password Reset successfully' }));
  } catch (err) {
    log.error('Error occurred while processing the request');
    next(_Error(500, 'An error occurred while processing the request', err));
  }
};

export default requestResetPassword;
