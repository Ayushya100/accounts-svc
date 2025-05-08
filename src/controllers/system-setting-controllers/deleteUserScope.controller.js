'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { deleteUserScopeById } from '../../db/index.js';
import { getScopeById } from './getUserScope.controller.js';

const log = logger('Controller: delete-user-scope');

const deleteScope = async (userId, scopeId, scopeDtl) => {
  try {
    log.info('Controller function to delete user scope from system process initiated');
    scopeId = convertPrettyStringToId(scopeId);
    userId = convertPrettyStringToId(userId);

    if (scopeDtl.core) {
      log.error('Cannot delete the core user scope');
      return {
        status: 400,
        message: 'Core user scope cannot be deleted',
        data: [],
        errors: [],
        stack: 'deleteScope function call',
        isValid: false,
      };
    }

    log.info('Call db query to soft delete the user scope from system');
    await deleteUserScopeById(userId, scopeId);
    let deletedScopeDtl = await getScopeById(scopeId, true);
    deletedScopeDtl = deletedScopeDtl.data;

    log.success('User scope deletion operation completed successfully');
    return {
      status: 200,
      message: 'User scope deleted successfully',
      data: deletedScopeDtl,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while deleting user scope from system');
    return {
      status: 500,
      message: 'An error occurred while deleting user scope from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { deleteScope };
