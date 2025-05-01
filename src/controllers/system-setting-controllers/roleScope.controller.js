'use strict';

import { convertIdToPrettyString, convertPrettyStringToId, logger } from 'finance-lib';
import { unassignedScopesByRoleId, assignedScopesByRoleId, getMultipleScopesByIds, assignScopesToRole, unassignScopesToRole } from '../../db/index.js';

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

const updateRoleScopeSet = async (userId, roleId, roleDtl, requestedScopes) => {
  try {
    log.info('Controller function to update scopes set for the requested role process initiated');
    userId = convertPrettyStringToId(userId);
    roleId = convertPrettyStringToId(roleId);

    log.info('Call db query to fetch the current assigned scopes records for the requested role');
    let assignedScopeDtl = await assignedScopesByRoleId(roleId);
    assignedScopeDtl = assignedScopeDtl.rows;
    const assignedScopes = assignedScopeDtl.map((scope) => {
      return scope.id;
    });

    const newRequestedScopes = requestedScopes.map((scopeId) => {
      return convertPrettyStringToId(scopeId);
    });

    let newScopesAssignment = newRequestedScopes;
    let deleteExistingScopesAssignment = [];
    if (assignedScopes) {
      newScopesAssignment = newRequestedScopes.filter((scopeId) => {
        return !assignedScopes.includes(scopeId);
      });
      deleteExistingScopesAssignment = assignedScopes.filter((scopeId) => {
        return !newRequestedScopes.includes(scopeId);
      });
    }

    if (newScopesAssignment.length > 0) {
      log.info('Call db query to validate if all the requested user scope ids are valid to proceed or not');
      let idsPlaceholder = newScopesAssignment.map(() => '?').join(', ');
      const getMultipleScopeRecords = await getMultipleScopesByIds(idsPlaceholder, newScopesAssignment);
      if (getMultipleScopeRecords.rowCount !== newScopesAssignment.length) {
        log.error('One of the scope id provided is not correct');
        return {
          status: 404,
          message: 'One of the scope id provided is not correct',
          data: getMultipleScopeRecords.rows,
          errors: [],
          stack: 'updateRoleScopeSet function call',
          isValid: false,
        };
      }

      log.info('Call db query to assign new scopes to the provided role id');
      idsPlaceholder = newScopesAssignment.map(() => '(?, ?)').join(', ');
      const bindings = newScopesAssignment.flatMap((scopeId) => [roleId, scopeId]);
      await assignScopesToRole(idsPlaceholder, bindings);
    }

    if (deleteExistingScopesAssignment.length > 0) {
      console.log(deleteExistingScopesAssignment);
      log.info('Call db query to unassign scopes for the provided role id');
      const idsPlaceholder = deleteExistingScopesAssignment.map(() => '?').join(', ');
      await unassignScopesToRole(userId, roleId, idsPlaceholder, deleteExistingScopesAssignment);
    }

    log.info('Call db query to fetch the newly assigned scopes records for the requested role');
    assignedScopeDtl = await assignedScopesByRoleId(roleId);
    if (assignedScopeDtl.rowCount === 0) {
      log.info('No user scope assigned to requested role');
      return {
        status: 204,
        message: 'No user scope exist',
        data: [],
        isValid: true,
      };
    }

    assignedScopeDtl = assignedScopeDtl.rows;
    const data = {
      id: convertIdToPrettyString(roleId),
      roleCode: roleDtl.roleCode,
      roleDesc: roleDtl.roleDesc,
      scopes: [],
    };

    assignedScopeDtl.forEach((scope) => {
      data.scopes.push({
        id: convertIdToPrettyString(scope.id),
        scopeCode: scope.scope_cd,
        scopeDesc: scope.scope_desc,
      });
    });

    log.success('User scopes update operation completed successfully');
    return {
      status: 201,
      message: 'User scopes registered',
      data: data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while updating user scopes assignment for requested role id from system');
    return {
      status: 500,
      message: 'An error occurred while updating user scopes assignment for requested role id from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { getUnassignedScopes, getAssignedScopes, updateRoleScopeSet };
