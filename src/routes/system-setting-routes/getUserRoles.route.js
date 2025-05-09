'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: get-user-roles');
const settingController = controllers.settingController;

// API Function
const getUserRoles = async (req, res, next) => {
  try {
    log.info('Get user roles request process initiated');
    const roleId = req.params.roleId;

    let userRolesDtl = {};
    if (roleId) {
      log.info('Call controller function to fetch user role for requested id');
      userRolesDtl = await settingController.getRoleById(roleId);
    } else {
      log.info('Call controller function to fetch all user roles from system');
      userRolesDtl = await settingController.getAllUserRoles();
    }
    if (!userRolesDtl.isValid) {
      throw userRolesDtl;
    }

    log.success('User roles fetched successfully');
    res.status(200).json(buildApiResponse(userRolesDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default getUserRoles;
