'use strict';

import { logger, _Error, _Response } from 'common-svc-lib';
import { SystemDB } from '../../db/index.js';
import { getUserRoleById } from './getUserRole.controller.js';

const log = logger('Controller: Register-Role');

const verifyUserRoleExist = async (roleCode) => {
  try {
    log.info('Controller function for validating user role existence in system initiated');
    log.info('Call db query to validate if user role already exists');
    const roleDtl = await SystemDB.getUserRoleByCode(roleCode);

    if (roleDtl.rowCount > 0) {
      log.error('User role already exists in system');
      throw _Error(409, 'User role already exists');
    }

    log.success('User role verification completed successfully');
    return _Response(200, 'User role does not exists in system', []);
  } catch (err) {
    log.error('Error while validating new user role in system');
    throw _Error(500, 'An error occurred while verifying user role in system', err);
  }
};

const registerNewUserRole = async (payload) => {
  try {
    log.info('Controller function to register new user role in system initiated');
    const providedDefaultVal = payload.is_default || null;
    payload.is_default = payload.is_default || false;
    payload.is_active = payload.is_active || false;

    if (providedDefaultVal) {
      log.info('call db query to deactivate existing default role');
      const currentAvailableRole = await SystemDB.getDefaultRole();
      if (currentAvailableRole.rowCount === 1) {
        await SystemDB.deactivateRole(currentAvailableRole.rows[0].id);
      }
    }

    log.info('Call db query to register new user role in system');
    const newRole = await SystemDB.registerNewRole(payload);
    const newRoleId = newRole.rows[0].id;
    const newRoleDtl = await getUserRoleById(newRoleId);

    log.success('New user role registered successfully in system');
    return _Response(201, 'User role registered successfully', newRoleDtl.data);
  } catch (err) {
    log.error('Error while registering new user role in system');
    throw _Error(500, 'An error occurred while registering new user role in system', err);
  }
};

export { verifyUserRoleExist, registerNewUserRole };
