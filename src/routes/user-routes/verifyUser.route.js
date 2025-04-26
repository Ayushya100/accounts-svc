'use strict';

import { logger, buildApiResponse } from 'finance-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: verify-user');
const userController = controllers.userController;

// API Function
const verifyUserEmail = async (req, res, next) => {
  try {
    log.info('Verify user email operation initiated!');

    const userId = req.params.userId;
    const token = req.params.token;

    log.info('Call controller function to check if the requested user exists or not');
    const isUserAvailable = await userController.getUserInfoById(userId);
    if (!isUserAvailable.isValid) {
      throw isUserAvailable;
    }

    log.info('Call controller function to verify user email via the provided token');
    const verifyUser = await userController.verifyUserToken(userId, token, isUserAvailable.data);
    if (!verifyUser.isValid) {
      throw verifyUser;
    }

    log.success('User email verification completed successfully!');
    res.status(200).json(buildApiResponse(verifyUser));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default verifyUserEmail;
