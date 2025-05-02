'use strict';

import { logger, buildApiResponse } from 'finance-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: assign-scope-to-role');
const settingController = controllers.settingController;

// API Function
const assignScopesToRole = async (req, res, next) => {
  try {
    log.info('Assign user scopes to requested role id operation initiated');
    const userId = req.user.id;
    const roleId = req.params.roleId;
    const requestedScopes = req.body.scopes;

    log.info('Call controller function to check if provided role id exists or not');
    const roleDtl = await settingController.getRoleById(roleId);
    if (!roleDtl.isValid) {
      throw roleDtl;
    }

    log.info('Call controller function to update user scopes set for the requested role');
    const roleScopeDtl = await settingController.updateRoleScopeSet(userId, roleId, roleDtl.data, requestedScopes);
    if (!roleScopeDtl.isValid) {
      throw roleScopeDtl;
    }

    log.success('User scopes assigned to requested role successfully');
    res.status(201).json(buildApiResponse(roleScopeDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default assignScopesToRole;
