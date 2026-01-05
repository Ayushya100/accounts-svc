'use strict';

import { logger, convertPrettyStringToId, formatResponseBody, _Response, _Error } from 'common-svc-lib';
import { SystemDB } from '../../db/index.js';
import { fieldMappings } from '../../utils/index.js';

const log = logger('Controller: Get-Role-Info');

const getUserRoleById = async (roleId) => {
  try {
    log.info('Controller function to fetch the details of user role by id process initiated');
    roleId = convertPrettyStringToId(roleId);

    log.info(`Call db query to fetch user role details for provided id: ${roleId}`);
    let roleDtl = await SystemDB.getUserRole(roleId);
    if (roleDtl.rowCount === 0) {
      log.error('User role requested with the id does not exists in system');
      throw _Error(404, 'User role not found');
    }

    roleDtl = roleDtl.rows;
    formatResponseBody(roleDtl, fieldMappings.userRoleFields);
    roleDtl = roleDtl[0];
    log.success('Requested role details fetched successfully');
    return _Response(200, 'User role found', roleDtl);
  } catch (err) {
    log.error('Error occurred while trying to fetch the details of user role for requested id');
    throw _Error(500, 'An error occurred while fetching user role details', err);
  }
};

const getAllUserRoles = async () => {
  try {
    log.info('Controller function to fetch all user roles process initiated');
    log.info('Call db query to fetch all user roles');

    let roleDtl = await SystemDB.getUserRole();
    if (roleDtl.rowCount === 0) {
      log.info('No user role available to return');
      return _Response(204, 'No user role found', roleDtl.rows);
    }

    roleDtl = roleDtl.rows;
    formatResponseBody(roleDtl, fieldMappings.userRoleFields);
    log.success('User roles fetched successfully');
    return _Response(200, 'User role found', roleDtl);
  } catch (err) {
    log.error('Error occurred while trying to fetch all user roles');
    throw _Error(500, 'An error occurred while fetching user roles', err);
  }
};

export { getUserRoleById, getAllUserRoles };
