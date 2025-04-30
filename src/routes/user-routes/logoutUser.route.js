'use strict';

import { logger, buildApiResponse } from 'finance-lib';
import controllers from '../../controllers/index.js';
import { COOKIE_OPTIONS } from '../../constants.js';

const log = logger('Router: logout-user');
const userController = controllers.userController;

// API Function
const logoutUser = async (req, res, next) => {
  try {
    log.info('Logout user request operation initiated');
    const userId = req.user.id;

    log.info('Call controller function to check if the user exists or not');
    const userInfo = await userController.getUserInfoById(userId);
    if (!userInfo.isValid) {
      throw userInfo;
    }

    log.info('Call controller function to complete logout operation for user');
    const userLogoutInfo = await userController.logout(userId);
    if (!userLogoutInfo.isValid) {
      throw userLogoutInfo;
    }

    log.success('User logout operation completed');
    res.status(200).clearCookie('accessToken', COOKIE_OPTIONS).clearCookie('refreshToken', COOKIE_OPTIONS).json(buildApiResponse(userLogoutInfo));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default logoutUser;
