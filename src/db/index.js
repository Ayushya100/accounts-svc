'use strict';

import {
    isSettingAvailable,
    registerNewSetting,
    getAllSettings,
    getSettingInfoById,
    getSystemUserSettingInfo,
    isRouteAvailable,
    registerNewRoute,
    isUserRoleAvailable,
    registerNewUserRole,
    getAllUserRole,
    getUserRoleById,
    updateUserRoleById,
    deleteUserRoleById
} from './settings.db.js';

export default {
    isSettingAvailable,
    registerNewSetting,
    getAllSettings,
    getSettingInfoById,
    getSystemUserSettingInfo,
    isRouteAvailable,
    registerNewRoute,
    isUserRoleAvailable,
    registerNewUserRole,
    getAllUserRole,
    getUserRoleById,
    updateUserRoleById,
    deleteUserRoleById
};
