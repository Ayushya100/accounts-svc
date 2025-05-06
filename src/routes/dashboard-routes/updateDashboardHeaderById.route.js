'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: update-dashboard-header');
const dashboardController = controllers.dashboardController;

// API Function
const updateDashboardHeader = async (req, res, next) => {
  try {
    log.info('Dashboard header info update for requested id operation initiated');
    const headerId = req.params.headerId;
    const userId = req.user.id;
    const payload = req.body;

    log.info('Call controller function to fetch the header information for provided id');
    const headerDtl = await dashboardController.getHeaderInfoById(headerId);
    if (!headerDtl.isValid) {
      throw headerDtl;
    }

    log.info('Call controller function to update the header information for provided id');
    const updatedHeaderDtl = await dashboardController.updateHeader(userId, headerId, headerDtl.data, payload);
    if (!updatedHeaderDtl.isValid) {
      throw updatedHeaderDtl;
    }

    log.success('Dashboard header information updated successfully');
    res.status(200).json(buildApiResponse(updatedHeaderDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default updateDashboardHeader;
