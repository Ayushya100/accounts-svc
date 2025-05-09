'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: get-all-dashboard-header');
const dashboardController = controllers.dashboardController;

// API Function
const getDashboardHeader = async (req, res, next) => {
  try {
    log.info('Get dashboard headers process initiated');
    const headerId = req.params.headerId;

    let headerDtl = {};
    if (headerId) {
      log.info('Call controller function to fetch the header info for requested id from system');
      headerDtl = await dashboardController.getHeaderInfoById(headerId);
    } else {
      log.info('Call controller function to fetch all header info from system');
      headerDtl = await dashboardController.getAllDashboardHeader();
    }
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

export default getDashboardHeader;
