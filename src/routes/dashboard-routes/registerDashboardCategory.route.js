'use strict';

import { buildApiResponse, logger } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: register-dashboard-category');
const dashboardController = controllers.dashboardController;

// API Function
const registerDashboardCategory = async (req, res, next) => {
  try {
    log.info('Register dashboard category request process initiated');
    const payload = req.body;

    log.info('Call controller function to validate if dashboard category already exists');
    const cateogryExist = await dashboardController.verifyCategoryExist(payload);
    if (!cateogryExist.isValid) {
      throw cateogryExist;
    }

    log.success('Dashboard category registration completed successfully');
    res.status(201).json(buildApiResponse(cateogryExist));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default registerDashboardCategory;
