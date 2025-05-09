'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: get-dashboard-setup');
const dashboardController = controllers.dashboardController;

// API Function
const getDashboardCategory = async (req, res, next) => {
  try {
    log.info('Get dashboard setup process initiated');
    const categoryId = req.params.categoryId;

    let categoryDtl = {};
    if (categoryId) {
      log.info('Call controller function to fetch the setup info for requested id from system');
      categoryDtl = await dashboardController.getCategoryInfoById(categoryId);
    } else {
      log.info('Call controller function to fetch all setup info from system');
      categoryDtl = await dashboardController.getAllCategory();
    }
    if (!categoryDtl.isValid) {
      throw categoryDtl;
    }

    console.log(categoryDtl);

    log.success('Dashboard setup into fetched successfully');
    res.status(200).json(buildApiResponse(categoryDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default getDashboardCategory;
