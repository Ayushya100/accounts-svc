'use strict';

import { _Error, _Response, convertPrettyStringToId, formatResponseBody, logger } from 'common-svc-lib';
import { SystemDB } from '../../db/index.js';
import { fieldMappings } from '../../utils/index.js';

const log = logger('Controller: Assign-Scopes');

const updateScopesListToRole = async (roleId, scopesArr, roleDtl) => {
  try {
    log.info('Controller function to update scope assignment for role process initiated');
    roleId = convertPrettyStringToId(roleId);
    scopesArr = scopesArr.map((scope) => convertPrettyStringToId(scope));

    log.info('Call db query to fetch current assigned scopes list');
    let scopeDtl = await SystemDB.getAssignedScopes(roleId);
    scopeDtl = scopeDtl.rows;
    const currentAssignedScopesId = scopeDtl.map((scope) => scope.id);

    let newScopesAssignment = scopesArr;
    let deleteExistingScopeAssignment = [];

    if (currentAssignedScopesId.length > 0) {
      newScopesAssignment = scopesArr.filter((scopeId) => {
        return !currentAssignedScopesId.includes(scopeId);
      });
      deleteExistingScopeAssignment = currentAssignedScopesId.filter((scopeId) => {
        return !scopesArr.includes(scopeId);
      });
    }

    if (newScopesAssignment.length > 0) {
      log.info('Call db query to validate if all the requested user scope ids are valid or not');
      let idsPlaceholder = newScopesAssignment.map(() => '?').join(', ');
      const multiScopeRecords = await SystemDB.getMultipleScopesByIds(idsPlaceholder, newScopesAssignment);
      if (multiScopeRecords.rowCount !== newScopesAssignment.length) {
        log.error('One of the scope id provided is not correct');
        throw _Error(404, 'One of the scope id provided is incorrect');
      }

      log.info('Call db query to assign new scopes to the provided role id');
      idsPlaceholder = newScopesAssignment.map(() => '(?, ?)').join(', ');
      const bindings = newScopesAssignment.flatMap((scopeId) => [roleId, scopeId]);
      await SystemDB.assignScopesToRole(bindings, newScopesAssignment.length);
    }

    if (deleteExistingScopeAssignment.length > 0) {
      log.info('Call db query to unassign scopes for the provided role id');
      const idsPlaceholder = deleteExistingScopeAssignment.map(() => '?').join(', ');
      await SystemDB.unassignScopesToRole(roleId, idsPlaceholder, deleteExistingScopeAssignment);
    }

    log.info('Call db query to fetch the newly assigned scopes for the requested role');
    scopeDtl = await SystemDB.getAssignedScopes(roleId);
    roleDtl.scopes = [];

    if (scopeDtl.rowCount > 0) {
      scopeDtl = scopeDtl.rows;
      formatResponseBody(scopeDtl, fieldMappings.userScopeFields);
      roleDtl.scopes = scopeDtl;
    }

    log.success('Scope assignment has been updated successfully');
    return _Response(200, 'Scope assignment has been updated successfull', roleDtl);
  } catch (err) {
    log.info('Error occurred while updating the scope assignment to the requested role');
    throw _Error(500, 'An error occurred while updating the scope assignment to the requested role', err);
  }
};

export { updateScopesListToRole };
