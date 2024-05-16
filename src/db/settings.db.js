'use strict';

import { Types } from 'mongoose';

// Import DB Models
import {
    dashboardSettingTemplate,
    serviceRoutesTemplate,
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

const isRouteAvailable = async(payload) => {
    const query = {
        path: payload.path
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
        roleName: payload.roleName
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

export {
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
    updateUserRoleById
};
