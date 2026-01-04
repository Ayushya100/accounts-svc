'use strict';

import { _Error, logger, ResponseBuilder } from 'common-svc-lib';
import controllers from '../../controllers/index.js';
import { COOKIE_OPTIONS } from '../../constants.js';

const log = logger('Route: Refresh-Token');
const accountController = controllers.accountController;

// API Function
const refreshToken = async (req, res, next) => {
  try {
    log.info('Refresh user token process initiated');
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      log.error('No refresh token found');
      throw _Error(404, 'Refresh Token not found');
    }

    log.info('Validate if refresh token active and valid');
    const decodedUserId = await accountController.isTokenAvailable(refreshToken);

    log.info('Fetch user info by decoded user id');
    const userInfo = await accountController.getUserInfoById(decodedUserId);

    log.info('Grant user access operation initiated');
    await accountController.grantUserAccess(userInfo.data);

    log.success('Refresh user token operation completed');
    res
      .status(200)
      .cookie('accessToken', userInfo.data.access_token, COOKIE_OPTIONS)
      .cookie('refreshToken', userInfo.data.refresh_token, COOKIE_OPTIONS)
      .json(ResponseBuilder(userInfo));
  } catch (err) {
    log.error('Error occurred while processing the request');
    next(_Error(500, 'An error occurred while processing the request', err));
  }
};

export default refreshToken;
