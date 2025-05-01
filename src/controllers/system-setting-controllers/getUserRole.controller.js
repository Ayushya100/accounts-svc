'use strict';

import { convertIdToPrettyString, convertPrettyStringToId, convertToNativeTimeZone, logger } from 'finance-lib';
import { getUserRoleById, getUserRoles } from '../../db/index.js';

const log = logger('Controller: get-user-role');

const getRoleById = async (roleId) => {
  try {
    log.info('Controller function to fetch user role by id process initiated');
    roleId = convertPrettyStringToId(roleId);

    log.info(`Call db query to fetch role details for provided id: ${roleId}`);
    let roleDtl = await getUserRoleById(roleId);
    if (roleDtl.rowCount === 0) {
      log.error('User role requested with the id does not exists in system');
      return {
        status: 404,
        message: 'User role not found',
        data: [],
        errors: [],
        stack: 'getUserRoleById function call',
        isValid: false,
      };
    }

    roleDtl = roleDtl.rows[0];
    roleDtl = {
      id: convertIdToPrettyString(roleDtl.id),
      roleCode: roleDtl.role_cd,
      roleDesc: roleDtl.role_desc,
      active: roleDtl.is_active,
      default: roleDtl.is_default,
      createdDate: convertToNativeTimeZone(roleDtl.created_date),
      modifiedDate: convertToNativeTimeZone(roleDtl.modified_date),
    };

    log.success('Requested role details fetched successfully');
    return {
      status: 200,
      message: 'User role fetched successfully',
      data: roleDtl,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while fetching user role for requested id from system');
    return {
      status: 500,
      message: 'An error occurred while fetching user role for requested id from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const getAllUserRoles = async () => {
  try {
    log.info('Controller function to fetch all user roles from system activated');
    log.info('Call db query to fetch all user roles from db');
    let userRolesDtl = await getUserRoles();
    if (userRolesDtl.rowCount === 0) {
      log.info('No user role available to display');
      return {
        status: 204,
        message: 'No user role found',
        data: [],
        isValid: true,
      };
    }

    userRolesDtl = userRolesDtl.rows;
    const roleDtls = userRolesDtl.map((roleDtl) => {
      return {
        id: convertIdToPrettyString(roleDtl.id),
        roleCode: roleDtl.role_cd,
        roleDesc: roleDtl.role_desc,
        active: roleDtl.is_active,
        default: roleDtl.is_default,
      };
    });

    log.success('User roles retrieval operation completed successfully');
    return {
      status: 200,
      message: 'User roles fetched successfully',
      data: roleDtls,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while retrieving all user roles from system');
    return {
      status: 500,
      message: 'An error occurred while retrieving all user roles from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { getAllUserRoles, getRoleById };
