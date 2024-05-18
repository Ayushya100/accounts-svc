'use strict';

import { Types } from 'mongoose';

// Import DB Templates
import {
    dashboardSettingTemplate,
    roleScopeTemplate,
    serviceRoutesTemplate,
    userDashboardTemplate,
    userRoleTemplate
} from 'lib-finance-service';

const isSettingAvailable = async(payload) => {
    const query = {
        categoryName: payload.categoryName,
        categoryType: payload.categoryType,
        subCategory: payload.subCategory,
        duration: payload.duration
    };
    const db = new dashboardSettingTemplate();
    return await db.findOne(query, null);
}

const registerNewSetting = async(payload) => {
    const db = new dashboardSettingTemplate();
    return await db.create(payload);
}

const getAllSettings = async() => {
    const query = {
        isDeleted: false
    };
    const db = new dashboardSettingTemplate();
    return await db.find(query, null);
}

const getSettingInfoById = async(settingLabel) => {
    let query;
    if (Types.ObjectId.isValid(settingLabel)) {
        query = {
            _id : settingLabel,
            isDeleted: false
        };
    } else {
        query = {
            categoryName: settingLabel,
            isDeleted: false
        };
    }

    const db = new dashboardSettingTemplate();
    return await db.findOne(query, null);
}

const getSystemUserSettingInfo = async(fieldsToRetrieve) => {
    const query = {
        categoryName: {
            $in: fieldsToRetrieve
        }
    };
    const db = new dashboardSettingTemplate();
    return await db.find(query, null);
}

const getUserAssignableSettings = async() => {
    const query = {
        isDeleted: false,
        isUserAssignable: true
    };
    const db = new dashboardSettingTemplate();
    return await db.find(query, null);
}

const isRouteAvailable = async(payload) => {
    const query = {
        path: payload.path,
        microservice: payload.microservice,
        method: payload.method
    };
    const db = new serviceRoutesTemplate();
    return await db.findOne(query, null);
}

const registerNewRoute = async(payload) => {
    const db = new serviceRoutesTemplate();
    return await db.create(payload);
}

const isUserRoleAvailable = async(payload) => {
    const query = {
        roleCode: payload.roleCode.toUpperCase(),
        roleName: payload.roleName,
        isDeleted: false
    };
    const db = new userRoleTemplate();
    return await db.findOne(query, null);
}

const isUserRoleByIdAvailable = async(roleId) => {
    const query = {
        _id: roleId,
        isDeleted: false
    };
    const db = new userRoleTemplate();
    return await db.findById(query, null);
}

const isDefaultUserRoleAvailable = async() => {
    const query = {
        isDefault: true,
        isDeleted: false
    };
    const db = new userRoleTemplate();
    return await db.findOne(query, null);
}

const registerNewUserRole = async(payload) => {
    const db = new userRoleTemplate();
    return await db.create(payload);
}

const getAllUserRole = async() => {
    const query = {
        isDeleted: false
    };
    const db = new userRoleTemplate();
    return await db.find(query, null);
}

const getUserRoleById = async(roleId) => {
    const query = {
        _id: roleId,
        isDeleted: false
    };
    const db = new userRoleTemplate();
    return await db.find(query, null);
}

const updateUserRoleById = async(userId, roleId, payload) => {
    const query = {
        _id: roleId
    };
    const db = new userRoleTemplate();
    return await db.findByIdAndUpdate(userId, query, payload, null);
}

const deleteUserRoleById = async(userId, roleId) => {
    const query = {
        _id: roleId
    };
    const payload = {
        isActive: false,
        isDeleted: true
    };
    const fields = 'roleCode roleName isActive isDeleted';

    const db = new userRoleTemplate();
    return await db.findByIdAndUpdate(userId, query, payload, fields);
}

const isScopeAvailable = async(payload) => {
    const query = {
        roleId: payload.roleId,
        scope: payload.scope.toUpperCase(),
        scopeDesc: payload.scopeDesc,
        isDeleted: false
    };
    const db = new roleScopeTemplate();
    return await db.findOne(query, null);
}

const registerNewScope = async(payload) => {
    const db = new roleScopeTemplate();
    return await db.create(payload);
}

const getAllUserScope = async(roleId) => {
    const query = {
        roleId: roleId,
        isDeleted: false
    };
    const db = new roleScopeTemplate();
    return await db.find(query, null);
}

const getUserScopeById = async(roleId, scopeId) => {
    const query = {
        _id: scopeId,
        roleId: roleId,
        isDeleted: false
    };
    const db = new roleScopeTemplate();
    return await db.findById(query, null);
}

const updateUserScopeById = async(userId, scopeId, payload) => {
    const query = {
        _id: scopeId
    };
    const db = new roleScopeTemplate();
    return await db.findByIdAndUpdate(userId, query, payload, null);
}

const deleteUserScopeById = async(userId, scopeId) => {
    const query = {
        _id: scopeId
    };
    const payload = {
        isDeleted: true
    };
    const fields = 'roleId scope scopeDesc isDeleted';

    const db = new roleScopeTemplate();
    return await db.findByIdAndUpdate(userId, query, payload, fields);
}

const getAllAppRoute = async() => {
    const query = {
        isDeleted: false
    };
    const db = new serviceRoutesTemplate();
    return await db.find(query, null);
}

const getAppRouteById = async(routeId) => {
    const query = {
        _id: routeId,
        isDeleted: false
    };
    const db = new serviceRoutesTemplate();
    return await db.find(query, null);
}

const updateAppRouteById = async(userId, routeId, payload) => {
    const query = {
        _id: routeId
    };
    const db = new serviceRoutesTemplate();
    return await db.findByIdAndUpdate(userId, query, payload, null);
}

const deleteAppRouteById = async(userId, routeId) => {
    const query = {
        _id: routeId
    };
    const payload = {
        isDeleted: true
    };
    const fields = 'path microservice port method validations isDeleted';

    const db = new serviceRoutesTemplate();
    return await db.findByIdAndUpdate(userId, query, payload, fields);
}

const createUserSettings = async(userSettings) => {
    const db = new userDashboardTemplate();
    return await db.create(userSettings);
}

export {
    isSettingAvailable,
    registerNewSetting,
    getAllSettings,
    getSettingInfoById,
    getSystemUserSettingInfo,
    getUserAssignableSettings,
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
    registerNewScope,
    getAllUserScope,
    getUserScopeById,
    updateUserScopeById,
    deleteUserScopeById,
    getAllAppRoute,
    getAppRouteById,
    updateAppRouteById,
    deleteAppRouteById,
    createUserSettings
};
