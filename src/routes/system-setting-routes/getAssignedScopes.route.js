'use strict';

import { buildApiResponse, logger } from 'finance-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: get-assigned-scopes');
const settingController = controllers.settingController;

// API Function
const getAssignedScopes = async (req, res, next) => {
  try {
    log.info('Get assigned user scopes for requested role id operation initiated');
    const roleId = req.params.roleId;

    log.info('Call controller function to check if provided role id exists or not');
    const roleDtl = await settingController.getRoleById(roleId);
    if (!roleDtl.isValid) {
      throw roleDtl;
    }

    log.info('Call controller function to fetch assigned user scopes for role');
    const scopeDtl = await settingController.getAssignedScopes(roleId);
    if (!scopeDtl.isValid) {
      throw scopeDtl;
    }

    log.success('Assigned user scopes fetched successfully');
    res.status(200).json(buildApiResponse(scopeDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default getAssignedScopes;
