'use strict';

import registerSetting from './registerSetting.route.js';
import getSettingInfo from './getSettingInfo.route.js';
import registerRoute from './registerRoute.route.js';
import registerUserRoleRoute from './registerUserRole.route.js';
import getUserRoleInfo from './getUserRole.route.js';
import updateUserRole from './updateUserRole.route.js';
import deleteUserRole from './deleteUserRole.route.js';
import createScope from './createScope.route.js';
import getUserScopeInfo from './getUserScope.route.js';
import updateUserScope from './updateUserScope.route.js';
import deleteUserScope from './deleteUserScope.route.js';

export default {
    registerSetting,
    getSettingInfo,
    registerRoute,
    registerUserRoleRoute,
    getUserRoleInfo,
    updateUserRole,
    deleteUserRole,
    createScope,
    getUserScopeInfo,
    updateUserScope,
    deleteUserScope
};
