'use strict';

import { _Error, _Response, convertPrettyStringToId, formatResponseBody, logger } from 'common-svc-lib';
import { SystemDB } from '../../db/index.js';
import { fieldMappings } from '../../utils/index.js';

const log = logger('Controller: Get-Scope-List');

const getAssignedScopesList = async (roleId, roleDtl) => {
  try {
    log.info('Controller function to fetch the assigned scopes to the requested role process initiated');
    roleId = convertPrettyStringToId(roleId);

    log.info('Call db query to fetch assigned scopes list');
    let scopeDtl = await SystemDB.getAssignedScopes(roleId);
    if (scopeDtl.rowCount > 0) {
      scopeDtl = scopeDtl.rows;
      formatResponseBody(scopeDtl, fieldMappings.userScopeFields);
      roleDtl.scopes = scopeDtl;
    } else {
      roleDtl.scopes = [];
    }

    log.success('Requested assigned scopes list to the provided role fetched successfully');
    return _Response(200, 'Assigned Scopes list fetched successfully', roleDtl);
  } catch (err) {
    log.info('Error occurred while fetching assigned scopes to the requested role');
    throw _Error(500, 'An error occurred while fetching assigned scopes to the requested role', err);
  }
};

const getUnassignedScopesList = async (roleId, roleDtl) => {
  try {
    log.info('Controller function to fetch the unassigned scopes to the requested role process initiated');
    roleId = convertPrettyStringToId(roleId);

    log.info('Call db query to fetch unassigned scopes list');
    let scopeDtl = await SystemDB.getUnassignedScopes(roleId);
    if (scopeDtl.rowCount > 0) {
      scopeDtl = scopeDtl.rows;
      formatResponseBody(scopeDtl, fieldMappings.userScopeFields);
      roleDtl.scopes = scopeDtl;
    } else {
      roleDtl.scopes = [];
    }

    log.success('Requested unassigned scopes list to the provided role fetched successfully');
    return _Response(200, 'Unassigned Scopes list fetched successfully', roleDtl);
  } catch (err) {
    log.info('Error occurred while fetching unassigned scopes to the requested role');
    throw _Error(500, 'An error occurred while fetching unassigned scopes to the requested role', err);
  }
};

export { getAssignedScopesList, getUnassignedScopesList };
