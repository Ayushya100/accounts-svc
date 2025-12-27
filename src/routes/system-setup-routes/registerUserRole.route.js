'use strict';

import { logger, ResponseBuilder, _Error } from 'common-svc-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: create-user-role');
const settingController = controllers.settingController;

// API Function
const registerUserRole = async (req, res, next) => {
  try {
    log.info('Register user role request process initiated');
    const payload = req.body;
    payload.role_code = payload.role_code.toUpperCase().trim();

    log.info('Call controller function to validate if role code valid to create or not');
    await settingController.verifyUserRoleExist(payload.role_code);

    log.info('Call controller function to register new user role in system');
    const roleDtl = await settingController.registerNewUserRole(payload);

    log.success('User role registered successfully');
    res.status(201).json(ResponseBuilder(roleDtl));
  } catch (err) {
    log.error('Error occurred while processing the request');
    next(_Error(500, 'An error occurred while processing the request', err));
  }
};

export default registerUserRole;
