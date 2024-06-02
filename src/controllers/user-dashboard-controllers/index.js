'use strict';

import { getSystemSetup } from './getSystemSetup.controller.js';
import { getAllUserDashboardSetting, getUserDashboardSettingById } from './getUserDashboardSetup.controller.js';
import { updateAllUserDashboardSetup, updateUserDashboardSetupById } from './updateUserDashboardSetup.controller.js';

export default {
    getSystemSetup,
    getAllUserDashboardSetting,
    getUserDashboardSettingById,
    updateAllUserDashboardSetup,
    updateUserDashboardSetupById
};
