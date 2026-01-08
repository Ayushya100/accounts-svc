'use strict';

import { _Error, logger, ResponseBuilder } from 'common-svc-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: Get-User-By-ID');
const accountController = controllers.accountController;

// API Function
const getUserDtlById = async (req, res, next) => {
  try {
    log.info('Fetch User Details for requested ID operation initiated');
    const userId = req.params.userId;
    console.log(userId);

    log.info('Call controller function to fetch details about the user by ID');
    const userDtl = await accountController.getUserInfoById(userId);
    console.log(userDtl);

    log.success('User Details has been fetched successfully');
    res.status(200).json(ResponseBuilder(userDtl));
  } catch (err) {
    log.error('Error occurred while processing the request');
    next(_Error(500, 'An error occurred while processing the request', err));
  }
};

export default getUserDtlById;
