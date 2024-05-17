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
    isUserRoleByIdAvailable,
    isDefaultUserRoleAvailable,
    registerNewUserRole,
    getAllUserRole,
    getUserRoleById,
    updateUserRoleById,
    deleteUserRoleById,
    isScopeAvailable,
    registerNewScope
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
    isUserRoleByIdAvailable,
    isDefaultUserRoleAvailable,
    registerNewUserRole,
    getAllUserRole,
    getUserRoleById,
    updateUserRoleById,
    deleteUserRoleById,
    isScopeAvailable,
    registerNewScope
};
