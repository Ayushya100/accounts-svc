'use strict';

import { verifyHeaderExist, registerNewDashboardHeader } from './registerDashboardHeader.controller.js';
import { getHeaderInfoById, getAllDashboardHeader } from './getDashboardHeader.controller.js';
import { updateHeader } from './updateDashboardHeader.controller.js';
import { verifyCategoryExist } from './registerDashboardCategory.controller.js';

export default {
  verifyHeaderExist,
  registerNewDashboardHeader,
  getHeaderInfoById,
  getAllDashboardHeader,
  updateHeader,
  verifyCategoryExist,
};
