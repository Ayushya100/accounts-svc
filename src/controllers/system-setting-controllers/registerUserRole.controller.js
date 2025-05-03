'use strict';

import { logger } from 'common-node-lib';
import { isRoleAvailable, getDefaultRole, deactivateRole, registerNewRole } from '../../db/index.js';
import { getRoleById } from './getUserRole.controller.js';

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
        data: [],
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
    log.info('Controller function to register new user role in system initiated');
    const providedDefaultVal = payload.default || null;
    payload['default'] = payload.default || false;

    if (providedDefaultVal) {
      log.info('Call db query to deactivate existing default role');
      const currentActiveRole = await getDefaultRole();
      if (currentActiveRole.rowCount === 1) {
        await deactivateRole(currentActiveRole.rows[0].id);
      }
    }

    log.info('Call db query to register new user role in system');
    const newRole = await registerNewRole(payload);
    const newRoleId = newRole.rows[0].id;

    const newRoleDtl = await getRoleById(newRoleId);
    if (!newRoleDtl.isValid) {
      log.error('Error while fetching newly created user role from system');
      return {
        status: 404,
        message: 'An error occurred while registering new user role in system',
        data: [],
        errors: [],
        stack: 'registerNewUserRole function call',
        isValid: false,
      };
    }

    log.success('New role registered successfully in system');
    return {
      status: 201,
      message: 'New user role registered',
      data: newRoleDtl.data,
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
