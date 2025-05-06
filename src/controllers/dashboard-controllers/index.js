'use strict';

import { verifyHeaderExist, registerNewDashboardHeader } from './registerDashboardHeader.controller.js';
import { getHeaderInfoById, getAllDashboardHeader } from './getDashboardHeader.controller.js';
import { updateHeader } from './updateDashboardHeader.controller.js';

export default {
  verifyHeaderExist,
  registerNewDashboardHeader,
  getHeaderInfoById,
  getAllDashboardHeader,
  updateHeader,
};
