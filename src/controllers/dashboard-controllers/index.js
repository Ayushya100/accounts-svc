'use strict';

import { verifyHeaderExist, registerNewDashboardHeader } from './registerDashboardHeader.controller.js';
import { getHeaderInfoById, getAllDashboardHeader } from './getDashboardHeader.controller.js';
import { updateHeader } from './updateDashboardHeader.controller.js';
import { verifyCategoryExist, registerNewDashboardCategory } from './registerDashboardCategory.controller.js';
import { getCategoryById } from '../../db/dashboard.db.js';

export default {
  verifyHeaderExist,
  registerNewDashboardHeader,
  getHeaderInfoById,
  getAllDashboardHeader,
  updateHeader,
  verifyCategoryExist,
  registerNewDashboardCategory,
  getCategoryById,
};
