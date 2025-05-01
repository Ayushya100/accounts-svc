'use strict';

import { logger, buildApiResponse } from 'finance-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: update-user-role');
const settingController = controllers.settingController;

// API Function
const updateUserRole = async (req, res, next) => {
  try {
    log.info('User role info update for requested id operation initiated');
    const roleId = req.params.roleId;
    const payload = req.body;
    const userId = req.user.id;

    log.info('Call controller function to fetch user role details for requested id');
    const roleDtl = await settingController.getRoleById(roleId);
    if (!roleDtl.isValid) {
      throw roleDtl;
    }

    log.info('Call controller function to update user role info');
    const updatedRoleDtl = await settingController.updateUserRole(userId, roleId, roleDtl.data, payload);
    if (!updatedRoleDtl.isValid) {
      throw updatedRoleDtl;
    }

    log.success('User role info update operation completed successfully');
    res.status(200).json(buildApiResponse(updatedRoleDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default updateUserRole;
