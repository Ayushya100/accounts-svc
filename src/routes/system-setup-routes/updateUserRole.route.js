'use strict';

import { _Error, logger, ResponseBuilder } from 'common-svc-lib';
import controllers from '../../controllers/index.js';
import { validateUpdateRoleSchema } from '../../utils/index.js';

const log = logger('Router: Update-Role');
const settingController = controllers.settingController;

// API Function
const updateUserRole = async (req, res, next) => {
  try {
    log.info('Update user role request process initiated');
    const payload = req.body;
    const roleId = req.params.roleId;
    const isDefault = req.query.default;

    log.info('Call controller function to validate if role with provided id exist');
    const roleDtl = await settingController.getUserRoleById(roleId);
    let updatedRoleDtl;

    if (isDefault) {
      log.info('Call controller function to update default value for requested user role');
      updatedRoleDtl = await settingController.updateRoleDefault(roleId, isDefault, roleDtl.data);
    } else {
      log.info('Call controller function to update the role info');
      validateUpdateRoleSchema(payload);
      updatedRoleDtl = await settingController.updateUserRoleDtl(roleId, payload, roleDtl.data);
    }

    log.success('User role updated successfully');
    res.status(200).json(ResponseBuilder(updatedRoleDtl));
  } catch (err) {
    log.error('Error occurred while processing the request');
    next(_Error(500, 'An error occurred while processing the request', err));
  }
};

export default updateUserRole;
