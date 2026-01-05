'use strict';

import { _Error, _Response, convertPrettyStringToId, logger } from 'common-svc-lib';
import { SystemDB } from '../../db/index.js';
import { getUserRoleById } from './getUserRole.controller.js';

const log = logger('Controller: Update-Role');

const deactivateExistingRole = async () => {
  try {
    log.info('Controller function to deactivate existing default user role');
    log.info('Call db query to deactivate existing default role');
    const currentAvailableRole = await SystemDB.getDefaultRole();
    if (currentAvailableRole.rowCount === 1) {
      await SystemDB.deactivateRole(currentAvailableRole.rows[0].id);
    }

    return true;
  } catch (err) {
    log.error('Error while deactivating existing default user role in system');
    throw _Error(500, 'An error occurred while deactivating existing default user role', err);
  }
};

const updateUserRoleDtl = async (roleId, payload, roleDtl) => {
  try {
    log.info('Controller function to update user role details in system initiated');
    roleId = convertPrettyStringToId(roleId);
    payload.is_active = payload.is_active !== null && payload.is_active !== undefined ? payload.is_active : roleDtl.is_active;
    payload.is_default = payload.is_default !== null && payload.is_default !== undefined ? payload.is_default : roleDtl.is_default;

    if (payload.is_default && !roleDtl.is_default) {
      await deactivateExistingRole();
    }

    log.info('Call db query to update user role info in system');
    await SystemDB.updateRoleDtl(roleId, payload);
    const updateRoleDtl = await getUserRoleById(roleId);

    log.success('User role details updated successfully in system');
    return _Response(200, 'User role details updated successfully', updateRoleDtl.data);
  } catch (err) {
    log.error('Error while updating user role info in system');
    throw _Error(500, 'An error occurred while updating user role detail in system', err);
  }
};

const updateRoleDefault = async (roleId, isDefault, roleDtl) => {
  try {
    log.info('Controller funciton to update default value for user role operation initiated');
    roleId = convertPrettyStringToId(roleId);

    if (isDefault && !roleDtl.is_default) {
      await deactivateExistingRole();
    }

    log.info('Call db query to update user role default value');
    await SystemDB.updateRoleDtl(roleId, null, isDefault);
    const updateRoleDtl = await getUserRoleById(roleId);

    log.success('User role default value updated successfully in system');
    return _Response(200, 'User role details updated successfully', updateRoleDtl.data);
  } catch (err) {
    log.error('Error while updating default value for user role info in system');
    throw _Error(500, 'An error occurred while updating user role default value in system', err);
  }
};

export { updateUserRoleDtl, updateRoleDefault };
