'use strict';

import { logger, buildApiResponse } from 'finance-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: register-user-role');
const settingController = controllers.settingController;

// API Function
const registerUserRole = async (req, res, next) => {
  try {
    log.info('Register user role request process initiated');
    const payload = req.body;
    payload.roleCode = payload.roleCode.toUpperCase().trim();

    log.info('Call controller function to validate if role code valid to create or not');
    const roleExist = await settingController.verifyUserRoleExist(payload.roleCode);
    if (!roleExist.isValid) {
      throw roleExist;
    }

    log.info('Call controller function to register new user role in system');
    const roleDtl = await settingController.registerNewUserRole(payload);
    if (!roleDtl.isValid) {
      throw roleDtl;
    }

    log.success('User role registered successfully');
    res.status(201).json(buildApiResponse(roleDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default registerUserRole;
