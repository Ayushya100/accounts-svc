'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: delete-user-role-by-id');
const settingController = controllers.settingController;

// API Function
const deleteUserRole = async (req, res, next) => {
  try {
    log.info('User role deletion operation initiated');
    const roleId = req.params.roleId;
    const userId = req.user.id;

    log.info('Call controller function to fetch user role details for requested id');
    const roleDtl = await settingController.getRoleById(roleId);
    if (!roleDtl.isValid) {
      throw roleDtl;
    }

    log.info('Call controller function to delete user role');
    const deleteRoleDtl = await settingController.deleteRole(userId, roleId, roleDtl.data);
    if (!deleteRoleDtl.isValid) {
      throw deleteRoleDtl;
    }

    log.success('Role deletion operation completed successfully');
    res.status(200).json(buildApiResponse(roleDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default deleteUserRole;
