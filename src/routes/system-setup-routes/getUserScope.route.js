'use strict';

import { _Error, logger, ResponseBuilder } from 'common-svc-lib';
import controllers from '../../controllers/index.js';

const log = logger('Route: Get-Scope');
const settingController = controllers.settingController;

// API Function
const getUserScope = async (req, res, next) => {
  try {
    log.info('Fetch user scope request process initiated');
    const scopeId = req.params.scopeId;
    let scopeDtl;

    if (scopeId) {
      log.info('Call controller function to fetch user scope for requested id');
      scopeDtl = await settingController.getUserScopeById(scopeId);
    } else {
      log.info('Call controller function to fetch all user scopes from system');
      scopeDtl = await settingController.getAllUserScopes();
    }

    log.success('User scopes fetched successfully');
    res.status(200).json(ResponseBuilder(scopeDtl));
  } catch (err) {
    log.error('Error occurred while processing the request');
    next(_Error(500, 'An error occurred while processing the request', err));
  }
};

export default getUserScope;
