'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: delete-setup-by-id');
const dashboardController = controllers.dashboardController;

// API Function
const deleteHeaderCategory = async (req, res, next) => {
  try {
    log.info('Dashboard configuration deletion operation initiated');
    const categoryId = req.params.categoryId;
    const userId = req.user.id;

    log.info('Call controller function to validate if setup for requested id exists');
    const categoryDtl = await dashboardController.getCategoryInfoById(categoryId);
    if (!categoryDtl.isValid) {
      throw categoryDtl;
    }

    log.info('Call controller funciton to delete the header setup for provided id');
    const deleteCategoryDtl = await dashboardController.deleteHeaderCategory(userId, categoryId, categoryDtl.data);
    if (!deleteCategoryDtl.isValid) {
      throw deleteCategoryDtl;
    }

    log.success('Dashboard configuration deletion operation completed successfully');
    res.status(200).json(buildApiResponse(deleteCategoryDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default deleteHeaderCategory;
