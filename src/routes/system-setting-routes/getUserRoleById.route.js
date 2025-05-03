'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: get-user-role-by-id');
const settingController = controllers.settingController;

// API Function
const getUserRoleById = async (req, res, next) => {
  try {
    log.info('Get user role by id operation initiated');
    const roleId = req.params.roleId;

    log.info('Call controller function to fetch user role for requested id');
    const roleDtl = await settingController.getRoleById(roleId);
    if (!roleDtl.isValid) {
      throw roleDtl;
    }

    log.success('User role by id process completed successfully');
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

export default getUserRoleById;
