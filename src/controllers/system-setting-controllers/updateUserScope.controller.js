'use strict';

import { convertPrettyStringToId, logger } from 'finance-lib';
import { updateUserScopeById } from '../../db/index.js';
import { getScopeById } from './getUserScope.controller.js';

const log = logger('Controller: update-user-scope');

const updateUserScope = async (userId, scopeId, scopeDtl, payload) => {
  try {
    log.info('Controller function to update user scope in system initiated');
    userId = convertPrettyStringToId(userId);
    scopeId = convertPrettyStringToId(scopeId);
    payload.scopeDesc = payload.scopeDesc || scopeDtl.scopeDesc;

    log.info('Call db query to update scope description in system');
    await updateUserScopeById(userId, scopeId, payload);
    let updatedScopeDtl = await getScopeById(scopeId);
    updatedScopeDtl = updatedScopeDtl.data;

    log.success('User scope info updated successfully in system');
    return {
      status: 200,
      message: 'User scope updated successfully',
      data: updatedScopeDtl,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while updating user scope in system');
    return {
      status: 500,
      message: 'An error occurred while updating user scope info in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { updateUserScope };
