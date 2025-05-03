'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: user-info');
const userController = controllers.userController;

// API Function
const userInfo = async (req, res, next) => {
  try {
    log.info('User info request operation initiated!');

    const userId = req.params.userId;

    log.info('Call controller function to get the details about the user');
    const userInfo = await userController.getUserDetailInfoById(userId);
    if (!userInfo.isValid) {
      throw userInfo;
    }

    res.status(200).json(buildApiResponse(userInfo));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default userInfo;
