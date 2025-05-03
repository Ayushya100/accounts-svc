'use strict';

import { buildApiResponse, logger } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: register-dashboard-header');
const dashboardController = controllers.dashboardController;

// API Function
const registerDashboardHeader = async (req, res, next) => {
  try {
    log.info('Register dashboard header request process initiated');
    const payload = req.body;
    payload.headerCode = payload.headerCode.trim().toUpperCase();

    log.info('Call controller function to validate if dashboard header already exists');
    const dashboardExist = await dashboardController.verifyHeaderExist(payload);
    if (!dashboardExist.isValid) {
      throw dashboardExist;
    }

    log.info('Call controller function to register new dashboard header in system');
    const headerDtl = await dashboardController.registerNewDashboardHeader(payload);
    if (!headerDtl.isValid) {
      throw headerDtl;
    }

    log.success('Dashboard registeration completed successfully');
    res.status(201).json(buildApiResponse(headerDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default registerDashboardHeader;
