'use strict';

import { convertPrettyStringToId, logger } from 'finance-lib';
import { getRoleById } from './getUserRole.controller.js';
import { deactivateRole, getDefaultRole, updateUserRoleById } from '../../db/system.db.js';

const log = logger('Controller: update-user-role');

const updateUserRole = async (userId, roleId, roleDtl, payload) => {
  try {
    log.info('Call controller function to update user role in system');
    if (roleDtl.default && (payload.active !== null && payload.active !== undefined) && !payload.active) {
      log.error('Cannot deactivate default user role');
      return {
        status: 400,
        message: 'Cannot deactivate default user role',
        data: [roleDtl],
        errors: [],
        stack: 'updateUserRole function call',
        isValid: false,
      };
    }

    if ((payload.active !== null && payload.active !== undefined) && (payload.default !== null && payload.default !== undefined) && !payload.active && payload.default) {
      log.error('Cannot make user role default and deactivate it.');
      return {
        status: 400,
        message: 'Cannot make user role default and deactivate the same.',
        data: [roleDtl],
        errors: [],
        stack: 'updateUserRole function call',
        isValid: false,
      };
    }

    const providedDefaultVal = payload.default || false;
    if (providedDefaultVal && !roleDtl.default) {
      log.info('Call db query to deactivate existing default role');
      const currentActiveRole = await getDefaultRole();
      if (currentActiveRole.rowCount === 1) {
        await deactivateRole(currentActiveRole.rows[0].id);
      }
    }

    userId = convertPrettyStringToId(userId);
    const body = {
      id: convertPrettyStringToId(roleId),
      roleDesc: payload.roleDesc || roleDtl.roleDesc,
      active: roleDtl.active,
      default: roleDtl.default,
    };

    if (payload.active !== null && payload.active !== undefined) {
      body['active'] = payload.active;
    }
    if (payload.default !== null && payload.default !== undefined) {
      body['default'] = payload.default;
    }

    log.info('Call db query to update user role info');
    await updateUserRoleById(userId, body);
    let updatedRoleDtl = await getRoleById(body.id);
    updatedRoleDtl = updatedRoleDtl.data;

    log.success('User role info updated successfully in system');
    return {
      status: 200,
      message: 'User role updated successfully',
      data: updatedRoleDtl,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while updating user role in system');
    return {
      status: 500,
      message: 'An error occurred while updating user role info in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { updateUserRole };
