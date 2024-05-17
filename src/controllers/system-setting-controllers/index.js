'use strict';

import {
    validateCreateSettingPayload,
    validateNewRoutePayload,
    validateNewUserRolePayload,
    validateNewScopePayload
} from './validatePayload.controller.js';
import { isSettingAvailable, createSetting } from './registerSetting.controller.js';
import { getAllSettings, getSettingInfoById } from './getSettingInfo.controller.js';
import { isRouteAvailable, createRoute } from './registerRoute.controller.js';
import { isUserRoleAvailable, createUserRole } from './registerUserRole.controller.js';
import { getAllUserRole, getUserRoleById } from './getUserRoleInfo.controller.js';
import { updateUserRole } from './updateUserRole.controller.js';
import { deleteUserRole } from './deleteUserRole.controller.js';
import { isDefaultUserAvailable, isUserRoleByIdAvailable } from './shared.controller.js';
import { isUserScopeAvailable, createUserScope } from './createScope.controller.js';
import { getAllUserScope, getUserScopeById } from './getUserScope.controller.js';
import { updatedUserScope } from './updateUserScope.controller.js';

export default {
    validateCreateSettingPayload,
    validateNewRoutePayload,
    validateNewUserRolePayload,
    validateNewScopePayload,
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
    isDefaultUserAvailable,
    isUserRoleByIdAvailable,
    isUserScopeAvailable,
    createUserScope,
    getAllUserScope,
    getUserScopeById,
    updatedUserScope
};
