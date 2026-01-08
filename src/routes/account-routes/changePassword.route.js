'use strict';

import { _Error, logger, ResponseBuilder } from 'common-svc-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: Change-Password');
const accountController = controllers.accountController;

// API Function
const changePassword = async (req, res, next) => {
  try {
    log.info('Change Password Request operation initiated');
    const payload = req.body;
    const userId = req.user.id;

    log.info('Call controller function to fetch user info for provided user id');
    const userDtl = await accountController.getUserInfoById(userId);

    log.info('Call controller function to update the user password');
    await accountController.updatePassword(userId, userDtl.data, payload, req.headers);

    log.success('Password change request completed successfully');
    res.status(200).json(ResponseBuilder({ status: 200, message: 'Password Reset successfully' }));
  } catch (err) {
    log.error('Error occurred while processing the request');
    next(_Error(500, 'An error occurred while processing the request', err));
  }
};

export default changePassword;
