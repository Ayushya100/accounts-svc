'use strict';

import { _Error, logger, ResponseBuilder } from 'common-svc-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: Delete-Role');
const settingController = controllers.settingController;

// API Function
const deleteUserRole = async (req, res, next) => {
  try {
    log.info('Delete user role request process initiated');
    const roleId = req.params.roleId;

    log.info('Call controller function to validate if role with provided id exist');
    const roleDtl = await settingController.getUserRoleById(roleId);

    if (roleDtl.data.is_default) {
      log.error('Default user role cannot be deleted');
      throw _Error(400, 'Default user role cannot be deleted');
    }
    log.info('Call controller function to delete user role for provided id');
    await settingController.deleteUserRole(roleId);

    log.success('User role deleted successfully');
    roleDtl.message = 'User role deleted successfully';
    res.status(200).json(ResponseBuilder(roleDtl));
  } catch (err) {
    log.error('Error occurred while processing the request');
    next(_Error(500, 'An error occurred while processing the request', err));
  }
};

export default deleteUserRole;
