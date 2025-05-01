'use strict';

import { convertIdToPrettyString, convertPrettyStringToId, logger } from 'finance-lib';
import { unassignedScopesByRoleId, assignedScopesByRoleId } from '../../db/index.js';

const log = logger('Controller: get-role-scope');

const getUnassignedScopes = async (roleId) => {
  try {
    log.info('Controller function to fetch unassigned user scopes process initiated');
    roleId = convertPrettyStringToId(roleId);

    log.info(`Call db query to fetch unassigned user scopes for provided role id: ${roleId}`);
    let unassignedScopeDtl = await unassignedScopesByRoleId(roleId);
    if (unassignedScopeDtl.rowCount === 0) {
      log.info('No user scope available to display');
      return {
        status: 204,
        message: 'No user scope found',
        data: [],
        isValid: true,
      };
    }

    unassignedScopeDtl = unassignedScopeDtl.rows;
    const scopeDtls = unassignedScopeDtl.map((scopeDtl) => {
      return {
        id: convertIdToPrettyString(scopeDtl.id),
        scopeCode: scopeDtl.scope_cd,
        scopeDesc: scopeDtl.scope_desc,
      };
    });

    log.success('User scopes retrieval operation completed successfully');
    return {
      status: 200,
      message: 'User scopes fetched successfully',
      data: scopeDtls,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while fetching unassigned user scopes for requested role id from system');
    return {
      status: 500,
      message: 'An error occurred while fetching unassigned user scopes for requested role id from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const getAssignedScopes = async (roleId) => {
  try {
    log.info('Controller function to fetch assigned user scopes process initiated');
    roleId = convertPrettyStringToId(roleId);

    log.info(`Call db query to fetch assigned user scopes for provided role id: ${roleId}`);
    let assignedScopeDtl = await assignedScopesByRoleId(roleId);
    if (assignedScopeDtl.rowCount === 0) {
      log.info('No user scope available to display');
      return {
        status: 204,
        message: 'No user scope found',
        data: [],
        isValid: true,
      };
    }

    assignedScopeDtl = assignedScopeDtl.rows;
    const scopeDtls = assignedScopeDtl.map((scopeDtl) => {
      return {
        id: convertIdToPrettyString(scopeDtl.id),
        scopeCode: scopeDtl.scope_cd,
        scopeDesc: scopeDtl.scope_desc,
      };
    });

    log.success('User scopes retrieval operation completed successfully');
    return {
      status: 200,
      message: 'User scopes fetched successfully',
      data: scopeDtls,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while fetching assigned user scopes for requested role id from system');
    return {
      status: 500,
      message: 'An error occurred while fetching assigned user scopes for requested role id from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { getUnassignedScopes, getAssignedScopes };
