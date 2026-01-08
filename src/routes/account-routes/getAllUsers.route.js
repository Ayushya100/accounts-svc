'use strict';

import { _Error, logger, ResponseBuilder } from 'common-svc-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: Get-All-Users');
const accountController = controllers.accountController;

// API Function
const getAllUsers = async (req, res, next) => {
  try {
    log.info('Get All Users request operation initiated');

    log.info('Call controller function to fetch the list of all users existing in system for admin');
    const userDtl = await accountController.getAllUsersList();

    log.success('Get All Users operation completed successfully');
    res.status(200).json(ResponseBuilder(userDtl));
  } catch (err) {
    log.error('Error occurred while processing the request');
    next(_Error(500, 'An error occurred while processing the request', err));
  }
};

export default getAllUsers;
