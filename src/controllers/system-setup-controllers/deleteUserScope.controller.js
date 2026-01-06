'use strict';

import { _Error, convertPrettyStringToId, logger } from 'common-svc-lib';
import { SystemDB } from '../../db/index.js';

const log = logger('Controller: Delete-Scope');

const deleteUserScope = async (scopeId) => {
  try {
    log.info('Controller function to delete user scope process initiated');
    scopeId = convertPrettyStringToId(scopeId);

    log.info('Call db query to delete requested user scope');
    await SystemDB.deleteScope(scopeId);

    log.success('Requested user scope deleted successfully');
    return true;
  } catch (err) {
    log.error('Error while deleting user scope in system');
    throw _Error(500, 'An error occurred while deleting requested user scope', err);
  }
};

export { deleteUserScope };
