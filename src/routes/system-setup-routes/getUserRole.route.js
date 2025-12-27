'use strict';

import { _Error, logger, ResponseBuilder } from 'common-svc-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: get-user-role');
const settingController = controllers.settingController;

// API Function
const getUserRole = async (req, res, next) => {
  try {
    log.info('Fetch user role request process initiated');
    const roleId = req.params.roleId;
    let roleDtl;

    if (roleId) {
      log.info('Call controller function to fetch the user role for requested id');
      roleDtl = await settingController.getUserRoleById(roleId);
    } else {
      log.info('Call controller function to fetch all user roles from system');
      roleDtl = await settingController.getAllUserRoles();
    }

    log.success('User roles fetched successfully');
    res.status(200).json(ResponseBuilder(roleDtl));
  } catch (err) {
    log.error('Error occurred while processing the request');
    next(_Error(500, 'An error occurred while processing the request', err));
  }
};

export default getUserRole;
