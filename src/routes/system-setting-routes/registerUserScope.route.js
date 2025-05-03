'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: register-user-scope');
const settingController = controllers.settingController;

// API Function
const registerUserScope = async (req, res, next) => {
  try {
    log.info('Register user scope request process initiated');
    const payload = req.body;
    payload.scopeCode = payload.scopeCode.toUpperCase().trim();

    log.info('Call controller function to validate if scope code valid to create or not');
    const scopeExist = await settingController.verifyUserScopeExist(payload.scopeCode);
    if (!scopeExist.isValid) {
      throw scopeExist;
    }

    log.info('Call controller function to register new user scope in system');
    const userScopeDtl = await settingController.registerNewUserScope(payload);
    if (!userScopeDtl.isValid) {
      throw userScopeDtl;
    }

    res.status(201).json(buildApiResponse(userScopeDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default registerUserScope;
