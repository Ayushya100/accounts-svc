'use strict';

import { _Error, logger, ResponseBuilder } from 'common-svc-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: Delete-Scope');
const settingController = controllers.settingController;

// API Function
const deleteUserScope = async (req, res, next) => {
  try {
    log.info('Delete user scope request process initiated');
    const scopeId = req.params.scopeId;

    log.info('Call controller function to validate if scope with provided id exist');
    const scopeDtl = await settingController.getUserScopeById(scopeId);

    log.info('Call controller function to delete user scope for provided id');
    await settingController.deleteUserScope(scopeId);

    log.success('User scope deleted successfully');
    scopeDtl.message = 'User scope deleted successfully';
    res.status(200).json(ResponseBuilder(scopeDtl));
  } catch (err) {
    log.error('Error occurred while processing the request');
    next(_Error(500, 'An error occurred while processing the request', err));
  }
};

export default deleteUserScope;
