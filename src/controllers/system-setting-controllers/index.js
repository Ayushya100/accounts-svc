'use strict';

import {
    validateCreateSettingPayload,
    validateNewRoutePayload,
    validateNewUserRolePayload,
    validateNewScopePayload
} from './validatePayload.controller.js';
import { isSettingAvailable, createSetting } from './registerSetting.controller.js';
import { getAllSettings, getSettingInfoById } from './getSettingInfo.controller.js';
import {
    isRouteAvailable,
    createRoute,
    restoreRoute
} from './registerRoute.controller.js';
import {
    isUserRoleAvailable,
    createUserRole,
    restoreRole
} from './registerUserRole.controller.js';
import { getAllUserRole, getUserRoleById } from './getUserRoleInfo.controller.js';
import { updateUserRole } from './updateUserRole.controller.js';
import { deleteUserRole } from './deleteUserRole.controller.js';
import { isDefaultUserAvailable, isUserRoleByIdAvailable } from './shared.controller.js';
import { isUserScopeAvailable, createUserScope } from './createScope.controller.js';
import { getAllUserScope, getUserScopeById } from './getUserScope.controller.js';
import { updatedUserScope } from './updateUserScope.controller.js';
import { deleteUserScope } from './deleteUserScope.controller.js';
import { getAllAppRouteInfo, getAppRoutebyId } from './getAppRoute.controller.js';
import { updateAppRoute } from './updateAppRoute.controller.js';
import { deleteAppRoute } from './deleteUserRoute.controller.js';

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
    restoreRoute,
    isUserRoleAvailable,
    createUserRole,
    restoreRole,
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
    updatedUserScope,
    deleteUserScope,
    getAllAppRouteInfo,
    getAppRoutebyId,
    updateAppRoute,
    deleteAppRoute
};
