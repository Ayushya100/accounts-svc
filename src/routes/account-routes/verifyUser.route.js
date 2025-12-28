'use strict';

import { _Error, logger, ResponseBuilder } from 'common-svc-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: verify-user');
const accountController = controllers.accountController;

// API Function
const verifyUser = async (req, res, next) => {
  try {
    log.info('Verify user email id operation initiated');
    const userId = req.params.userId;
    const token = req.params.token;

    log.info('Call controller function to check if the requested user exists or not');
    const userInfo = await accountController.getUserInfoById(userId);

    if (userInfo.data.is_verified) {
      log.error('User already verified');
      throw _Error(400, 'User already verified');
    }

    log.info('Call controller function to verify user email via the provided token');
    const verifiedUser = await accountController.verifyUserToken(userId, token, userInfo.data);

    log.success('User email verification completed successfully!');
    res.status(200).json(ResponseBuilder(verifiedUser));
  } catch (err) {
    log.error('Error occurred while processing the request');
    next(_Error(500, 'An error occurred while processing the request', err));
  }
};

export default verifyUser;
