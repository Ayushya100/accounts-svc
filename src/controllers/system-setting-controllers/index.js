'use strict';

import {
    validateCreateSettingPayload,
    validateNewRoutePayload,
    validateNewUserRolePayload
} from './validatePayload.controller.js';
import { isSettingAvailable, createSetting } from './registerSetting.controller.js';
import { getAllSettings, getSettingInfoById } from './getSettingInfo.controller.js';
import { isRouteAvailable, createRoute } from './registerRoute.controller.js';
import { isUserRoleAvailable, createUserRole } from './registerUserRole.controller.js';
import { getAllUserRole, getUserRoleById } from './getUserRoleInfo.controller.js';
import { updateUserRole } from './updateUserRole.controller.js';
import { deleteUserRole } from './deleteUserRole.controller.js';
import { isDefaultUserAvailable } from './shared.controller.js';

export default {
    validateCreateSettingPayload,
    validateNewRoutePayload,
    validateNewUserRolePayload,
    isSettingAvailable,
    createSetting,
    getAllSettings,
    getSettingInfoById,
    isRouteAvailable,
    createRoute,
    isUserRoleAvailable,
    createUserRole,
    getAllUserRole,
    getUserRoleById,
    updateUserRole,
    deleteUserRole,
    isDefaultUserAvailable
};
