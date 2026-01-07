'use strict';

import { logger, ResponseBuilder } from 'common-svc-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: Assign-Scopes');
const settingController = controllers.settingController;

// API Function
const assignScopes = async (req, res, next) => {
  try {
    log.info('Assign scopes for role process initiated');
    const roleId = req.params.roleId;
    const payload = req.body;

    log.info('Call controller funciton to validate if user role for requested id exists');
    const roleDtl = await settingController.getUserRoleById(roleId);

    log.info('Call controller function to update scope assignment list to requested role');
    const updatedRoleScopeDtl = await settingController.updateScopesListToRole(roleId, payload.scopes, roleDtl.data);

    log.success('Scopes assignment to the requested role has been updated successfully');
    res.status(200).json(ResponseBuilder(updatedRoleScopeDtl));
  } catch (err) {
    log.error('Error occurred while processing the request');
    next(_Error(500, 'An error occurred while processing the request', err));
  }
};

export default assignScopes;
