'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';
import { verifyDashboardCategoryPayload } from '../../utils/index.js';

const log = logger('Router: update-dashboard-header');
const dashboardController = controllers.dashboardController;

// API Function
const updateDashboardCategory = async (req, res, next) => {
  try {
    log.info('Dashboard setup info update for requested id operation initiated');
    const categoryId = req.params.categoryId;
    const userId = req.user.id;
    const payload = req.body;

    log.info('Call validator to verify the payload');
    const verificationResult = verifyDashboardCategoryPayload(payload);
    console.log(verificationResult);
    if (!verificationResult.isValid) {
      throw verificationResult;
    }
    console.log('Verification Successfull');

    log.info('Call controller function to fetch the setup information for provided id');
    const categoryDtl = await dashboardController.getCategoryInfoById(categoryId);
    if (!categoryDtl.isValid) {
      throw categoryDtl;
    }

    if (payload.headerId && payload.headerId !== categoryDtl.data.header.id) {
      log.info('Call controller function to validate if dashboard header exists');
      const headerExist = await dashboardController.getHeaderInfoById(payload.headerId);
      if (!headerExist.isValid) {
        throw headerExist;
      }
    }

    log.info('Call controller function to update the setup information for provided id');
    const updatedCategoryDtl = await dashboardController.updateCategory(userId, categoryId, categoryDtl.data, payload);
    if (!updatedCategoryDtl.isValid) {
      throw updatedCategoryDtl;
    }
    console.log(updatedCategoryDtl);

    log.success('Dashboard setup information updated successfully');
    res.status(200).json(buildApiResponse(updatedCategoryDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default updateDashboardCategory;
