'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: delete-header-by-id');
const dashboardController = controllers.dashboardController;

// API Function
const deleteDashboardHeader = async (req, res, next) => {
  try {
    log.info('Dashboard header deletion operation initiated');
    const headerId = req.params.headerId;
    const userId = req.user.id;

    log.info('Call controller function to validate if header for requested id exists');
    const headerDtl = await dashboardController.getHeaderInfoById(headerId);
    if (!headerDtl.isValid) {
      throw headerDtl;
    }

    log.info('Call controller function to delete the header info');
    const deletedHeaderDtl = await dashboardController.deleteHeader(userId, headerId, headerDtl.data);
    if (!deletedHeaderDtl.isValid) {
      throw deletedHeaderDtl;
    }

    log.success('Dashboard header deletion operation completed successfully');
    res.status(200).json(buildApiResponse(deletedHeaderDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default deleteDashboardHeader;
