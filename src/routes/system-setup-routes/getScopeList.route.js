'use strict';

import { _Error, logger, ResponseBuilder } from 'common-svc-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: Get-Scope-List');
const settingController = controllers.settingController;

// API Function
const getScopeList = async (req, res, next) => {
  try {
    log.info('Fetch scopes list for requested role process initiated');
    const roleId = req.params.roleId;
    const operationType = req.query.type;

    log.info('Call controller function to validate if user role for requested id exists');
    const roleDtl = await settingController.getUserRoleById(roleId);

    let roleScopeDtl;
    if (operationType === 'assigned') {
      log.info('Call controller function to fetch assigned scopes list for the requested role');
      roleScopeDtl = await settingController.getAssignedScopesList(roleId, roleDtl.data);
    } else if (operationType === 'unassigned') {
      log.info('Call controller function to fetch unassigned scopes list for the requested role');
      roleScopeDtl = await settingController.getUnassignedScopesList(roleId, roleDtl.data);
    } else {
      log.error(`Incorrect operation type [${operationType}] requested.`);
      throw _Error(400, 'Incorrect operation type requested');
    }

    log.success('Requested scopes and role details fetched successfully');
    res.status(200).json(ResponseBuilder(roleScopeDtl));
  } catch (err) {
    log.error('Error occurred while processing the request');
    next(_Error(500, 'An error occurred while processing the request', err));
  }
};

export default getScopeList;
