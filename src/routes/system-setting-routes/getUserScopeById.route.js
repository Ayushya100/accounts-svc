'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: get-user-scope-by-id');
const settingController = controllers.settingController;

// API Function
const getUserScopeById = async (req, res, next) => {
  try {
    log.info('Get user scope by id operation initiated');
    const scopeId = req.params.scopeId;

    log.info('Call controller function to fetch user scope for requested id');
    const scopeDtl = await settingController.getScopeById(scopeId);
    if (!scopeDtl.isValid) {
      throw scopeDtl;
    }

    log.success('User scope by id process completed successfuly');
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

export default getUserScopeById;
