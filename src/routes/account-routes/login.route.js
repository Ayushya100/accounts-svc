'use strict';

import { logger, _Error, ResponseBuilder } from 'common-svc-lib';
import controllers from '../../controllers/index.js';
import { validateFields } from '../../utils/index.js';
import { COOKIE_OPTIONS } from '../../constants.js';

const log = logger('Router: login');
const accountController = controllers.accountController;

// API Function
const loginUser = async (req, res, next) => {
  try {
    log.info('Login user request operation initiated');
    const payload = req.body;

    let validationResult = true;
    if (payload.userIdentifier.includes('@')) {
      validationResult = validateFields({ email_id: payload.userIdentifier }, ['email_id']);
    } else {
      validationResult = validateFields({ username: payload.userIdentifier }, ['username']);
    }
    if (validationResult !== true) {
      log.error('Invalid user identifier provided');
      throw _Error(400, validationResult);
    }

    log.info('Call controller function to check if the requested user exists or not');
    const userDtl = await accountController.getUserInfoByIdentity(payload.userIdentifier);

    log.info('Call controller function to login the user after verification');
    const accessGrantedDtl = await accountController.loginUserVerification(userDtl.data, payload.password, req.headers);

    log.success('User login operation completed');
    res
      .status(200)
      .cookie('accessToken', accessGrantedDtl.access_token, COOKIE_OPTIONS)
      .cookie('refreshToken', accessGrantedDtl.refresh_token, COOKIE_OPTIONS)
      .json(ResponseBuilder(accessGrantedDtl));
  } catch (err) {
    log.error('Error occurred while processing the request');
    next(_Error(500, 'An error occurred while processing the request', err));
  }
};

export default loginUser;
