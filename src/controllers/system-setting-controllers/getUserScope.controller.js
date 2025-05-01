'use strict';

import { convertIdToPrettyString, convertPrettyStringToId, convertToNativeTimeZone, logger } from 'finance-lib';
import { getUserScopeById, getUserScopes } from '../../db/index.js';

const log = logger('Controller: get-user-scope');

const getScopeById = async (scopeId) => {
  try {
    log.info('Controller function to fetch user scope by id process initiated');
    scopeId = convertPrettyStringToId(scopeId);

    log.info(`Call db query to fetch scope details for provided id: ${scopeId}`);
    let scopeDtl = await getUserScopeById(scopeId);
    if (scopeDtl.rowCount === 0) {
      log.error('User scope requested with the id does not exists in system');
      return {
        status: 404,
        message: 'User scope not found',
        data: [],
        errors: [],
        stack: 'getScopeById function call',
        isValid: false,
      };
    }

    scopeDtl = scopeDtl.rows[0];
    scopeDtl = {
      id: convertIdToPrettyString(scopeDtl.id),
      scopeCode: scopeDtl.scope_cd,
      scopeDesc: scopeDtl.scope_desc,
      createdDate: convertToNativeTimeZone(scopeDtl.created_date),
      modifiedDate: convertToNativeTimeZone(scopeDtl.modified_date),
    };

    log.success('Requested user scope details fetched successfully');
    return {
      status: 200,
      message: 'User scope fetched successfully',
      data: scopeDtl,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while fetching user scope for requested id from system');
    return {
      status: 500,
      message: 'An error occurred while fetching user scope for requested id from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const getAllUserScopes = async() => {
  try {
    log.info('Controller function to fetch all user scopes from system initiated');
    log.info('Call db query to fetch all user scopes from db');
    let userScopesDtl = await getUserScopes();
    if (userScopesDtl.rowCount === 0) {
      log.info('No user scope available to display');
      return {
        status: 204,
        message: 'No user scope found',
        data: [],
        isValid: true
      };
    }

    userScopesDtl = userScopesDtl.rows;
    const scopeDtls = userScopesDtl.map((scopeDtl) => {
      return {
        id: convertIdToPrettyString(scopeDtl.id),
        scopeCode: scopeDtl.scope_cd,
        scopeDesc: scopeDtl.scope_desc
      };
    });

    log.success('User scopes retrieval operation completed successfully');
    return {
      status: 200,
      message: 'User scopes fetched successfully',
      data: scopeDtls,
      isValid: true
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
}

export { getScopeById, getAllUserScopes };
