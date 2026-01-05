'use strict';

import { _Error, _Response, convertPrettyStringToId, formatResponseBody, logger } from 'common-svc-lib';
import { SystemDB } from '../../db/index.js';
import { fieldMappings } from '../../utils/index.js';

const log = logger('Controller: Get-Scope-Info');

const getUserScopeById = async (scopeId) => {
  try {
    log.info('Controller function to fetch the details of user scope by id process initiated');
    scopeId = convertPrettyStringToId(scopeId);

    log.info(`Call db query to fetch user scope details for provided id: ${scopeId}`);
    let scopeDtl = await SystemDB.getUserScope(null, scopeId);
    if (scopeDtl.rowCount === 0) {
      log.error('User scope requested with the id does not exists in system');
      throw _Error(404, 'User scope not found');
    }

    scopeDtl = scopeDtl.rows;
    formatResponseBody(scopeDtl, fieldMappings.userScopeFields);
    scopeDtl = scopeDtl[0];
    log.success('Requested scope details fetched successfully');
    return _Response(200, 'User scope found', scopeDtl);
  } catch (err) {
    log.error('Error occurred while trying to fetch the details of user scope for requested id');
    throw _Error(500, 'An error occurred while fetching user scope details', err);
  }
};

const getAllUserScopes = async () => {
  try {
    log.info('Controller funciton to fetch all user scopes process initiated');
    log.info('Call db query to fetch all user scopes');
    let scopeDtl = await SystemDB.getUserScope();
    if (scopeDtl.rowCount === 0) {
      log.info('No user scope available to return');
      return _Response(204, 'No user scope found', scopeDtl.rows);
    }

    scopeDtl = scopeDtl.rows;
    formatResponseBody(scopeDtl, fieldMappings.userScopeFields);
    log.success('User scopes fetched successfully');
    return _Response(200, 'User scope found', scopeDtl);
  } catch (err) {
    log.error('Error occurred while trying to fetch all user scopes');
    throw _Error(500, 'An error occurred while fetching user scopes', err);
  }
};

export { getUserScopeById, getAllUserScopes };
