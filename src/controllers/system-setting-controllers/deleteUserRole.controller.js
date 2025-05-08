'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { deleteUserRoleById } from '../../db/index.js';
import { getRoleById } from './getUserRole.controller.js';

const log = logger('Controller: delete-user-role');

const deleteRole = async (userId, roleId, roleDtl) => {
  try {
    log.info('Controller function to delete user role from system process initiated');
    roleId = convertPrettyStringToId(roleId);
    userId = convertPrettyStringToId(userId);

    if (roleDtl.default) {
      log.error('Cannot delete the default user role');
      return {
        status: 400,
        message: 'Default user role cannot be deleted',
        data: [],
        errors: [],
        stack: 'deleteRole function call',
        isValid: false,
      };
    }

    if (roleDtl.core) {
      log.error('Cannot delete the core user role');
      return {
        status: 400,
        message: 'Core user role cannot be deleted',
        data: [],
        errors: [],
        stack: 'deleteRole function call',
        isValid: false,
      };
    }

    log.info('Call db query to soft delete the user role from system');
    await deleteUserRoleById(userId, roleId);
    let deletedRoleDtl = await getRoleById(roleId);
    deletedRoleDtl = deletedRoleDtl.data;

    log.success('User role deletion operation completed successfully');
    return {
      status: 200,
      message: 'User role deleted successfully',
      data: deletedRoleDtl,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while deleting user role from system');
    return {
      status: 500,
      message: 'An error occurred while deleting user role from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { deleteRole };
