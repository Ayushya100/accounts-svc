'use strict';

import { _Error, _Response, logger } from 'common-svc-lib';
import { SystemDB } from '../../db/index.js';
import { getUserScopeById } from './getUserScope.controller.js';

const log = logger('Controller: Register-Scope');

const verifyUserScopeExist = async (scopeCode) => {
  try {
    log.info('Controller function for validating user scope existence in system initiated');
    log.info('Call db query to validate if user scope already exists');
    const scopeDtl = await SystemDB.getUserScopeByCode(scopeCode);

    if (scopeDtl.rowCount > 0) {
      log.error('User scope already exists in system');
      throw _Error(409, 'User scope already exists');
    }

    log.success('User scope verification completed successfully');
    return _Response(200, 'User scope does not exists in system', []);
  } catch (err) {
    log.error('Error while validating new user scope in system');
    throw _Error(500, 'An error occurred while validating user scope in system', err);
  }
};

const registerNewUserScope = async (payload) => {
  try {
    log.info('Controller function to register new user scope process initiated');
    log.info('Call db query to register new user scope in system');
    const newScope = await SystemDB.registerNewScope(payload);
    const newScopeId = newScope.rows[0].id;
    const newScopeDtl = await getUserScopeById(newScopeId);

    log.success('New user scope registered successfully in system');
    return _Response(201, 'User scope registered successfully', newScopeDtl.data);
  } catch (err) {
    log.error('Error while registering new user scope in system');
    throw _Error(500, 'An error occurred while registering new user scope in system', err);
  }
};

export { verifyUserScopeExist, registerNewUserScope };
