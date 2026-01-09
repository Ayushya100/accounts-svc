'use strict';

import { _Error, logger, ResponseBuilder } from 'common-svc-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: Update-User-Status');
const accountController = controllers.accountController;

// API Function
const updateUserStatus = async (req, res, next) => {
  try {
    log.info('Update User status operation initiated');
    const userId = req.params.userId;

    log.info('Call controller function to verify and fetch details for the requested user');
    const userDtl = await accountController.getUserInfoById(userId, true);

    log.info('Call controller funciton to change the user status');
    await accountController.changeUserStatus(userId, userDtl.data);

    userDtl.message = 'User status has been updated';

    log.success('User status has been updated successfully');
    res.status(200).json(ResponseBuilder(userDtl));
  } catch (err) {
    log.error('Error occurred while processing the request');
    next(_Error(500, 'An error occurred while processing the request', err));
  }
};

export default updateUserStatus;
