'use strict';

import { _Error, convertPrettyStringToId, logger } from 'common-svc-lib';
import { SystemDB } from '../../db/index.js';

const log = logger('Controller: Delete-Role');

const deleteUserRole = async (roleId) => {
  try {
    log.info('Controller function to delete user role process initiated');
    roleId = convertPrettyStringToId(roleId);

    log.info('Call db query to delete requested user role');
    await SystemDB.deleteRole(roleId);

    log.success('Requested user role deleted successfully');
    return true;
  } catch (err) {
    log.error('Error while deleting user role in system');
    throw _Error(500, 'An error occurred while deleting requested user role', err);
  }
};

export { deleteUserRole };
