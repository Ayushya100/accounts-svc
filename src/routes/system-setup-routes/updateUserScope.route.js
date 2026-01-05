'use strict';

import { logger, ResponseBuilder } from 'common-svc-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: Update-Scope');
const settingController = controllers.settingController;

// API Function
const updateUserScope = async (req, res, next) => {
  try {
    log.info('Update user scope request process initiated');
    const payload = req.body;
    const scopeId = req.params.scopeId;

    log.info('Call controller function to validate if scope with provided id exist');
    const scopeDtl = await settingController.getUserScopeById(scopeId);

    log.info('Call controller function to update the scope info');
    const updatedScopeDtl = await settingController.updateUserScope(scopeId, payload, scopeDtl.data);

    log.success('User scope updated successfully');
    res.status(200).json(ResponseBuilder(updatedScopeDtl));
  } catch (err) {
    log.error('Error occurred while processing the request');
    next(_Error(500, 'An error occurred while processing the request', err));
  }
};

export default updateUserScope;
