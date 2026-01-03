'use strict';

import { _Error, logger, ResponseBuilder } from 'common-svc-lib';
import controllers from '../../controllers/index.js';
import { validateFields } from '../../utils/index.js';

const log = logger('Router: register-user');
const accountController = controllers.accountController;

// API Function
const registerUser = async (req, res, next) => {
  try {
    log.info('Register new user request process initiated');
    const payload = req.body;

    log.info('Verify the required patterns for mandate fields');
    const validationResult = validateFields(payload, ['username', 'email_id', 'password']);
    if (validationResult !== true) {
      throw _Error(400, validationResult);
    }

    log.info('Call controller function to check if the requested username and email id available');
    await accountController.verifyUsernameEmailAlreadyTaken(payload);

    log.info('Call controller function to register new user in system');
    const userDtl = await accountController.registerNewUser(payload, req.headers);

    res.status(201).json(ResponseBuilder(userDtl));
  } catch (err) {
    log.error('Error occurred while processing the request');
    next(_Error(500, 'An error occurred while processing the request', err));
  }
};

export default registerUser;
