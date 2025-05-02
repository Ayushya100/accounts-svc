'use strict';

import { logger, buildApiResponse } from 'finance-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: get-all-user-scopes');
const settingController = controllers.settingController;

// API Function
const getAllUserScopes = async (req, res, next) => {
  try {
    log.info('Get all user scopes request process initiated');
    log.info('Call controller function to fetch all user scopes from system');
    const userScopesDtl = await settingController.getAllUserScopes();
    if (!userScopesDtl.isValid) {
      throw userScopesDtl;
    }

    log.success('User scopes fetched successfully');
    res.status(200).json(buildApiResponse(userScopesDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default getAllUserScopes;
