'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: get-all-dashboard-header');
const dashboardController = controllers.dashboardController;

// API Function
const getAllDashboardHeader = async (req, res, next) => {
  try {
    log.info('Get all dashboard headers process initiated');
    log.info('Call controller function to fetch all header info from system');
    const headerDtl = await dashboardController.getAllDashboardHeader();
    if (!headerDtl.isValid) {
      throw headerDtl;
    }

    log.success('Dashboard Headers info fetched successfully');
    res.status(200).json(buildApiResponse(headerDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default getAllDashboardHeader;
