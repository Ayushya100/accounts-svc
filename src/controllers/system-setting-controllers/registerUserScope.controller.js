'use strict';

import { logger } from 'common-node-lib';
import { isScopeAvailable, registerNewScope } from '../../db/index.js';
import { getScopeById } from './getUserScope.controller.js';

const log = logger('Controller: register-user-scope');

const verifyUserScopeExist = async (scopeCd) => {
  try {
    log.info('Controller for validating user scope existence in system initiated');
    log.info('Call db query to validate if scope already exists');
    const scopeDtl = await isScopeAvailable(scopeCd);
    if (scopeDtl.rowCount > 0) {
      log.error('User scope already exists in system');
      return {
        status: 409,
        message: 'User scope already exists',
        data: [],
        errors: [],
        stack: 'verifyUserScopeExist function call',
        isValid: false,
      };
    }

    log.success('User scope verification completed successfully');
    return {
      status: 200,
      message: 'User scope does not exists in system.',
      data: {},
      isValid: true,
    };
  } catch (err) {
    log.error('Error while validating new user scope in system');
    return {
      status: 500,
      message: 'An error occurred while validating user scope in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const registerNewUserScope = async (payload) => {
  try {
    log.info('Controller function to register new user scope in system initiated');
    log.info('Call db query to register new scope in system');
    const newScope = await registerNewScope(payload);
    const newScopeId = newScope.rows[0].id;

    const newScopeDtl = await getScopeById(newScopeId);
    if (!newScopeDtl.isValid) {
      log.error('Error while fetching newly created user scope for system');
      return {
        status: 404,
        message: 'An error occurred while registering new user scope in system',
        data: [],
        errors: [],
        stack: 'registerNewUserScope function call',
        isValid: false,
      };
    }

    log.success('New scope registered successfully in system');
    return {
      status: 201,
      message: 'New user scope registered',
      data: newScopeDtl.data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while registering new user scope in system');
    return {
      status: 500,
      message: 'An error occurred while registering new user scope in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { verifyUserScopeExist, registerNewUserScope };
