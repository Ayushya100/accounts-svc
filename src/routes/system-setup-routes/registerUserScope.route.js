'use strict';

import { logger, ResponseBuilder, _Error } from 'common-svc-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: Register-Scope');
const settingController = controllers.settingController;

// API Function
const registerUserScope = async (req, res, next) => {
  try {
    log.info('Register user scope request process initiated');
    const payload = req.body;
    payload.scope_code = payload.scope_code.toUpperCase().trim();

    log.info('Call controller function to validate if scope code valid to create or not');
    await settingController.verifyUserScopeExist(payload.scope_code);

    log.info('Call controller function to register new user scope in system');
    const scopeDtl = await settingController.registerNewUserScope(payload);

    log.success('User scope registered successfully');
    res.status(201).json(ResponseBuilder(scopeDtl));
  } catch (err) {
    log.error('Error occurred while processing the request');
    next(_Error(500, 'An error occurred while processing the request', err));
  }
};

export default registerUserScope;
