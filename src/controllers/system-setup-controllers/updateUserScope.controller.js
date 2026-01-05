'use strict';

import { _Error, _Response, convertPrettyStringToId, logger } from 'common-svc-lib';
import { SystemDB } from '../../db/index.js';
import { getUserScopeById } from './getUserScope.controller.js';

const log = logger('Controller: Update-Scope');

const updateUserScope = async (scopeId, payload, scopeDtl) => {
  try {
    log.info('Controller function to update user scope details in system initiated');
    scopeId = convertPrettyStringToId(scopeId);
    payload.scope_desc = payload.scope_desc || scopeDtl.scope_desc;

    log.info('Call db query to update user scope info in system');
    await SystemDB.updateScopeDtl(scopeId, payload);
    const updateScopeDtl = await getUserScopeById(scopeId);

    log.success('User scope details updated successfully in system');
    return _Response(200, 'User scope details updated successfully', updateScopeDtl.data);
  } catch (err) {
    log.error('Error while updating user scope info in system');
    throw _Error(500, 'An error occurred while updating user scope in system', err);
  }
};

export { updateUserScope };
