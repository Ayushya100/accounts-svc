'use strict';

import { buildApiResponse, logger } from 'common-node-lib';
import controllers from '../../controllers/index.js';
import { verifyDashboardCategoryPayload } from '../../utils/index.js';

const log = logger('Router: register-dashboard-setup');
const dashboardController = controllers.dashboardController;

// API Function
const registerDashboardCategory = async (req, res, next) => {
  try {
    log.info('Register dashboard setup request process initiated');
    const payload = req.body;
    payload.categoryCode = payload.categoryCode.toUpperCase().trim();
    payload.categoryType = payload.categoryType.trim();

    log.info('Call validator to verify the payload');
    const verificationResult = verifyDashboardCategoryPayload(payload);
    if (!verificationResult.isValid) {
      throw verificationResult;
    }

    log.info('Call controller function to validate if dashboard setup already exists');
    const cateogryExist = await dashboardController.verifyCategoryExist(payload.categoryCode);
    if (!cateogryExist.isValid) {
      throw cateogryExist;
    }

    log.info('Call controller function to validate if dashboard header exists');
    const headerExist = await dashboardController.getHeaderInfoById(payload.headerId);
    if (!headerExist.isValid) {
      throw headerExist;
    }

    log.info('Call controller function to register new dashboard setup in system');
    const categoryDtl = await dashboardController.registerNewDashboardCategory(payload);
    if (!categoryDtl.isValid) {
      throw categoryDtl;
    }

    log.success('Dashboard setup registration completed successfully');
    res.status(201).json(buildApiResponse(categoryDtl));
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
