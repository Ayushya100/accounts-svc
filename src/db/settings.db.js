'use strict';

import { Types } from 'mongoose';
import { dbOperations, ServiceRoutesModel, UserRoleModel } from 'lib-finance-service';

// Import DB Models
import { 
    DashboardSettingsModel
} from 'lib-finance-service';

const isSettingAvailable = async(payload) => {
    const query = {
        categoryName: payload.categoryName,
        categoryType: payload.categoryType,
        subCategory: payload.subCategory,
        duration: payload.duration
    };
    const db = new dbOperations(DashboardSettingsModel);
    return await db.findOne(query, null);
}

const registerNewSetting = async(payload) => {
    const db = new dbOperations(DashboardSettingsModel);
    return await db.create(payload);
}

const getAllSettings = async() => {
    const query = {
        isDeleted: false
    };
    const fields = 'categoryName categoryDescription categoryType subCategory type isPeriodic duration';

    const db = new dbOperations(DashboardSettingsModel);
    return await db.find(query, fields);
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
    const fields = 'categoryName categoryDescription categoryType subCategory type isPeriodic duration';

    const db = new dbOperations(DashboardSettingsModel);
    return await db.findOne(query, fields);
}

const getSystemUserSettingInfo = async(fieldsToRetrieve) => {
    const query = {
        categoryName: {
            $in: fieldsToRetrieve
        }
    };
    const fields = 'categoryName categoryDescription categoryType subCategory type isPeriodic duration';

    const db = new dbOperations(DashboardSettingsModel);
    return await db.find(query, fields);
}

const isRouteAvailable = async(payload) => {
    const query = {
        path: payload.path
    };
    const db = new dbOperations(ServiceRoutesModel);
    return await db.findOne(query, null);
}

const registerNewRoute = async(payload) => {
    const db = new dbOperations(ServiceRoutesModel);
    return await db.create(payload);
}

const isUserRoleAvailable = async(payload) => {
    const query = {
        roleCode: payload.roleCode.toUpperCase(),
        roleName: payload.roleName
    };
    const db = new dbOperations(UserRoleModel);
    return await db.findOne(query, null);
}

const registerNewUserRole = async(payload) => {
    const db = new dbOperations(UserRoleModel);
    return await db.create(payload);
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
    registerNewUserRole
};
