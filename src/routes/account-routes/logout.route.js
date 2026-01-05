'use strict';

import { logger, ResponseBuilder } from 'common-svc-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: Logout');
const accountController = controllers.accountController;

// API Function
const logoutUser = async (req, res, next) => {
  try {
    log.info('User logout request operation initiated!');
    const userId = req.user.id;

    log.info('Call controller function to verify if the user exists');
    await accountController.getUserInfoById(userId);

    log.info('Call controller function to mark user as logout');
    const userInfo = await accountController.logout(userId);

    log.success('User loged-out successfully');
    res.status(200).json(ResponseBuilder(userInfo));
  } catch (err) {
    log.error('Error occurred while processing the request');
    next(_Error(500, 'An error occurred while processing the request', err));
  }
};

export default logoutUser;
