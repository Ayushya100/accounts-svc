'use strict';

import { logger, buildApiResponse } from 'finance-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: update-user-scope');
const settingController = controllers.settingController;

// API Function
const updateUserScope = async (req, res, next) => {
  try {
    log.info('User scope info update for requested id operation initiated');
    const scopeId = req.params.scopeId;
    const userId = req.user.id;
    const payload = req.body;

    log.info('Call controller function to fetch user scope details for requested id');
    const scopeDtl = await settingController.getScopeById(scopeId);
    if (!scopeDtl.isValid) {
      throw scopeDtl;
    }

    log.info('Call controller function to update user scope info');
    const updatedScopeDtl = await settingController.updateUserScope(userId, scopeId, scopeDtl.data, payload);
    if (!updatedScopeDtl.isValid) {
      throw updatedScopeDtl;
    }

    log.success('User scope info update operation completed successfully');
    res.status(200).json(buildApiResponse(updatedScopeDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default updateUserScope;
