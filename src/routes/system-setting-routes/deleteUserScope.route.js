'use strict';

import { logger, buildApiResponse } from 'finance-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: delete-user-scope-by-id');
const settingController = controllers.settingController;

// API Function
const deleteUserScope = async (req, res, next) => {
  try {
    log.info('User scope deletion operation initiated');
    const scopeId = req.params.scopeId;
    const userId = req.user.id;

    log.info('Call controller function to fetch user scope details for requested id');
    const scopeDtl = await settingController.getScopeById(scopeId);
    if (!scopeDtl.isValid) {
      throw scopeDtl;
    }

    log.info('Call controller function to delete user scope');
    const deleteScopeDtl = await settingController.deleteScope(userId, scopeId);
    if (!deleteScopeDtl.isValid) {
      throw deleteScopeDtl;
    }

    res.status(200).json(buildApiResponse(deleteScopeDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default deleteUserScope;
