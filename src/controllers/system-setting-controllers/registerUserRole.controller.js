'use strict';

import { convertIdToPrettyString, convertToNativeTimeZone, logger } from 'finance-lib';
import { isRoleAvailable, getDefaultRole, deactivateRole, registerNewRole, getUserRoleById } from '../../db/index.js';

const log = logger('Controller: register-user-role');

const verifyUserRoleExist = async (roleCd) => {
  try {
    log.info('Controller for validating user role existence in system activated');
    log.info('Call db query to validate if role already exists');
    const roleDtl = await isRoleAvailable(roleCd);
    if (roleDtl.rowCount > 0) {
      log.error('User role already exists in system');
      return {
        status: 409,
        message: 'User role already exists',
        data: roleDtl.rows,
        errors: [],
        stack: 'verifyUserRoleExist function call',
        isValid: false,
      };
    }

    log.success('User role verification completed successfully');
    return {
      status: 200,
      message: 'User role does not exists in system.',
      data: {},
      isValid: true,
    };
  } catch (err) {
    log.error('Error while validating new user role in system');
    return {
      status: 500,
      message: 'An error occurred while validating user role in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const registerNewUserRole = async (payload) => {
  try {
    log.info('Call controller function to register new user role in system');
    const providedDefaultVal = payload.default || null;
    payload['default'] = payload.default || false;

    if (providedDefaultVal) {
      log.info('Call db query to deactivate existing default role');
      const currentActiveRole = await getDefaultRole();
      if (currentActiveRole.rowCount === 1) {
        deactivateRole(currentActiveRole.rows[0].id);
      }
    }

    log.info('Call db query to register new user role in system');
    const newRole = await registerNewRole(payload);
    const newRoleId = newRole.rows[0].id;

    let newRoleDtl = await getUserRoleById(newRoleId);
    newRoleDtl = newRoleDtl.rows[0];
    newRoleDtl = {
      id: convertIdToPrettyString(newRoleDtl.id),
      roleCode: newRoleDtl.role_cd,
      roleDesc: newRoleDtl.role_desc,
      active: newRoleDtl.is_active,
      default: newRoleDtl.is_default,
      createdDate: convertToNativeTimeZone(newRoleDtl.created_date),
      modifiedDate: convertToNativeTimeZone(newRoleDtl.modified_date),
    };

    log.success('New role registered successfully in system');
    return {
      status: 200,
      message: 'New user role registered',
      data: newRoleDtl,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while registering new user role in system');
    return {
      status: 500,
      message: 'An error occurred while registering new user role in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { verifyUserRoleExist, registerNewUserRole };
