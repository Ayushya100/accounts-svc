'use strict';

import { verifyHeaderExist, registerNewDashboardHeader } from './registerDashboardHeader.controller.js';
import { getHeaderInfoById, getAllDashboardHeader } from './getDashboardHeader.controller.js';
import { updateHeader } from './updateDashboardHeader.controller.js';
import { verifyCategoryExist, registerNewDashboardCategory } from './registerDashboardCategory.controller.js';
import { getCategoryInfoById, getAllCategory } from './getDashboardCategory.controller.js';
import { updateCategory } from './updateDashboardCategory.controller.js';
import { deleteHeaderCategory } from './deleteCategory.controller.js';

export default {
  verifyHeaderExist,
  registerNewDashboardHeader,
  getHeaderInfoById,
  getAllDashboardHeader,
  updateHeader,
  verifyCategoryExist,
  registerNewDashboardCategory,
  getCategoryInfoById,
  getAllCategory,
  updateCategory,
  deleteHeaderCategory,
};
