'use strict';

import registerDashboardHeader from './registerDashboardHeader.route.js';
import getDashboardHeader from './getDashboardHeader.route.js';
import updateDashboardHeader from './updateDashboardHeaderById.route.js';
import registerDashboardCategory from './registerDashboardCategory.route.js';
import getDashboardCategory from './getDashboardCategory.route.js';
import updateDashboardCategory from './updateDashboardCategoryById.route.js';
import deleteHeaderCategory from './deleteCategoryById.route.js';

export default {
  registerDashboardHeader,
  getDashboardHeader,
  updateDashboardHeader,
  registerDashboardCategory,
  getDashboardCategory,
  updateDashboardCategory,
  deleteHeaderCategory,
};
