'use strict';

import { _Error, logger, ResponseBuilder } from 'common-svc-lib';
import controller from '../../controllers/index.js';

const log = logger('Router: Get-User-Info');
const accountController = controller.accountController;

// API Function
const userInfo = async (req, res, next) => {
  try {
    log.info('Get user info request operation initiated');
    const userId = req.user.id;

    log.info('Call controller function to get the details about the user');
    const userInfo = await accountController.getUserDetailInfoById(userId);

    log.success('User info request operation completed successfully');
    res.status(200).json(ResponseBuilder(userInfo));
  } catch (err) {
    log.error('Error occurred while processing the request');
    next(_Error(500, 'An error occurred while processing the request', err));
  }
};

export default userInfo;
