'use strict';

import { buildApiResponse, logger } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: get-unassigned-scopes');
const settingController = controllers.settingController;

// API Function
const getUnassignedScopes = async (req, res, next) => {
  try {
    log.info('Get unassigned user scopes for requested role id operation initiated');
    const roleId = req.params.roleId;

    log.info('Call controller function to check if provided role id exists or not');
    const roleDtl = await settingController.getRoleById(roleId);
    if (!roleDtl.isValid) {
      throw roleDtl;
    }

    log.info('Call controller function to fetch unassigned user scopes for role');
    const scopeDtl = await settingController.getUnassignedScopes(roleId);
    if (!scopeDtl.isValid) {
      throw scopeDtl;
    }

    log.success('Unassigned user scopes fetched successfully');
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

export default getUnassignedScopes;
