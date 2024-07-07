'use strict';

import { Types } from 'mongoose';
import mongoose from 'mongoose';

// Import DB Templates
import {
    dashboardSettingTemplate,
    roleScopeTemplate,
    serviceConfigTemplate,
    serviceRoutesTemplate,
    userDashboardTemplate,
    userRoleTemplate
} from 'lib-finance-service';

const settingDB = new dashboardSettingTemplate();
const dashboardDB = new userDashboardTemplate();
const roleDB = new userRoleTemplate();
const routeDB = new serviceRoutesTemplate();
const scopeDB = new roleScopeTemplate();
const configDB = new serviceConfigTemplate();

const isSettingAvailable = async(payload) => {
    const query = {
        categoryName: payload.categoryName,
        categoryType: payload.categoryType,
        subCategory: payload.subCategory,
        duration: payload.duration
    };
    return await settingDB.findOne(query, null);
}

const registerNewSetting = async(payload) => {
    return await settingDB.create(payload);
}

const getAllSettings = async() => {
    const query = {
        isDeleted: false
    };
    return await settingDB.find(query, null);
}

const getSettingInfoByLabel = async(settingLabel) => {
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
    return await settingDB.findOne(query, null);
}

const getSettingInfoById = async(settingLabel) => {
    let query = {
        _id : settingLabel,
        isDeleted: false
    };

    return await settingDB.findOne(query, null);
}

const getSystemUserSettingInfo = async(fieldsToRetrieve) => {
    const query = {
        categoryName: {
            $in: fieldsToRetrieve
        }
    };
    return await settingDB.find(query, null);
}

const getUserAssignableSettings = async() => {
    const query = {
        isDeleted: false,
        isUserAssignable: true
    };
    return await settingDB.find(query, null);
}

const isRouteAvailable = async(payload) => {
    const query = {
        path: payload.path,
        microservice: payload.microservice,
        method: payload.method
    };
    return await routeDB.findOne(query, null);
}

const isServiceAvailable = async(payload) => {
    const query = {
        microservice: payload.microservice,
        environment: payload.environment,
        protocol: payload.protocol
    };
    return await configDB.findOne(query, null);
}

const restoreRoute = async(userId, route) => {
    const query = {
        _id: route._id
    };
    const payload = {
        isDeleted: false
    };
    return await routeDB.findByIdAndUpdate(userId, query, payload, null);
}

const isUserRoleAvailable = async(payload) => {
    const query = {
        roleCode: payload.roleCode.toUpperCase(),
        roleName: payload.roleName
    };
    return await roleDB.findOne(query, null);
}

const restoreRole = async(userId, role) => {
    const query = {
        _id: role._id
    };
    const payload = {
        isDeleted: false,
        isActive: true
    };
    return await roleDB.findByIdAndUpdate(userId, query, payload, null);
}

const isUserRoleByIdAvailable = async(roleId) => {
    const query = {
        _id: roleId,
        isDeleted: false
    };
    return await roleDB.findById(query, null);
}

const isDefaultUserRoleAvailable = async() => {
    const query = {
        isDefault: true,
        isDeleted: false
    };
    return await roleDB.findOne(query, null);
}

const getAllUserRole = async() => {
    const query = {
        isDeleted: false
    };
    return await roleDB.find(query, null);
}

const getUserRoleById = async(roleId) => {
    const query = {
        _id: roleId,
        isDeleted: false
    };
    return await roleDB.find(query, null);
}

const updateUserRoleById = async(userId, roleId, payload) => {
    const query = {
        _id: roleId
    };
    return await roleDB.findByIdAndUpdate(userId, query, payload, null);
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
    return await roleDB.findByIdAndUpdate(userId, query, payload, fields);
}

const isScopeAvailable = async(payload) => {
    const query = {
        roleId: payload.roleId,
        scope: payload.scope.toUpperCase(),
        scopeDescription: payload.scopeDescription,
        isDeleted: false
    };
    return await scopeDB.findOne(query, null);
}

const getAllUserScope = async(roleId) => {
    const query = {
        roleId: roleId,
        isDeleted: false
    };
    return await scopeDB.find(query, null);
}

const getUserScopeById = async(roleId, scopeId) => {
    const query = {
        _id: scopeId,
        roleId: roleId,
        isDeleted: false
    };
    return await scopeDB.findOne(query, null);
}

const updateUserScopeById = async(userId, scopeId, payload) => {
    const query = {
        _id: scopeId
    };
    return await scopeDB.findByIdAndUpdate(userId, query, payload, null);
}

const deleteUserScopeById = async(userId, roleId, scopeId) => {
    const query = {
        _id: scopeId,
        roleId: roleId
    };
    const payload = {
        isDeleted: true
    };
    const fields = 'roleId scope scopeDesc isDeleted';
    return await scopeDB.findOneAndUpdate(userId, query, payload, fields);
}

const getAllAppRoute = async() => {
    const query = {
        isDeleted: false
    };
    return await routeDB.find(query, null);
}

const getAppRouteById = async(routeId) => {
    const query = {
        _id: routeId,
        isDeleted: false
    };
    return await routeDB.find(query, null);
}

const updateAppRouteById = async(userId, routeId, payload) => {
    const query = {
        _id: routeId
    };
    return await routeDB.findByIdAndUpdate(userId, query, payload, null);
}

const deleteAppRouteById = async(userId, routeId) => {
    const query = {
        _id: routeId
    };
    const payload = {
        isDeleted: true
    };
    const fields = 'path microservice port method validations isDeleted';
    return await routeDB.findByIdAndUpdate(userId, query, payload, fields);
}

const createUserSettings = async(userSettings) => {
    return await dashboardDB.create(userSettings);
}

const getUserDashboardSetup = async(userId, fieldsToRetrieve) => {
    const matchQuery = {
        userId: new mongoose.mongoose.Types.ObjectId(userId),
        isDeleted: false
    };
    const lookupRecord = {
        from: 'dashboard_settings',
        localField: 'settingId',
        foreignField: '_id',
        as: 'dashboard'
    };
    const lookupQuery = {
        'dashboard.isDeleted': false,
        'dashboard.categoryName': {
            $in: fieldsToRetrieve
        }
    };
    const lookupFields = {
        categoryName: {
            $arrayElemAt: ['$dashboard.categoryName', 0]
        },
        categoryDescription: {
            $arrayElemAt: ['$dashboard.categoryDescription', 0]
        }
    };
    const projectionFields = {
        categoryName: 1,
        categoryDescription: 1,
        value: 1,
        type: 1
    };

    return await dashboardDB.aggregate(matchQuery, lookupRecord, lookupQuery, lookupFields, projectionFields);
}

const getDashboardSettingByUserId = async(userId, settingId) => {
    const matchQuery = {
        userId: new mongoose.mongoose.Types.ObjectId(userId),
        isDeleted: false
    };
    const lookupRecord = {
        from: 'dashboard_settings',
        localField: 'settingId',
        foreignField: '_id',
        as: 'dashboard'
    };
    const lookupQuery = {
        'dashboard.isDeleted': false
    };
    const lookupFields = {
        categoryName: {
            $arrayElemAt: ['$dashboard.categoryName', 0]
        },
        categoryDescription: {
            $arrayElemAt: ['$dashboard.categoryDescription', 0]
        },
        categoryType: {
            $arrayElemAt: ['$dashboard.categoryType', 0]
        },
        subCategory: {
            $arrayElemAt: ['$dashboard.subCategory', 0]
        },
        isPeriodic: {
            $arrayElemAt: ['$dashboard.isPeriodic', 0]
        },
        duration: {
            $arrayElemAt: ['$dashboard.duration', 0]
        }
    };
    const projectionFields = {
        categoryName: 1,
        categoryDescription: 1,
        categoryType: 1,
        subCategory: 1,
        isPeriodic: 1,
        duration: 1,
        type: 1,
        value: 1
    };

    if (settingId) {
        matchQuery._id = new mongoose.mongoose.Types.ObjectId(settingId)
    }

    return await dashboardDB.aggregate(matchQuery, lookupRecord, lookupQuery, lookupFields, projectionFields);
}

const updateUserDashboardSetting = async(userId, payload, settingId, isAllUpdate = false) => {
    if (isAllUpdate) {
        const updateQuery = payload.map(record => ({
            updateOne: {
                filter: {
                    _id: record._id,
                    userId: userId
                },
                update: {
                    $set: {
                        value: record.value,
                        modifiedOn: Date.now(),
                        modifiedBy: userId
                    }
                }
            }
        }));
        return await dashboardDB.bulkWrite(updateQuery);
    } else {
        const query = {
            _id: settingId,
            userId: userId,
            isDeleted: false
        };
        const queryPayload = {
            value: payload.value
        };
        return await dashboardDB.findByIdAndUpdate(userId, query, queryPayload, null);
    }
}

const updateSystemDashboardSetting = async(userId, settingRecord, isAllUpdate = false) => {
    if (isAllUpdate) {
        const updateQuery = settingRecord.map(record => ({
            updateOne: {
                filter: {
                    _id: record._id,
                    isDeleted: false
                },
                update: {
                    $set: {
                        categoryName: record.categoryName,
                        categoryDescription: record.categoryDescription,
                        categoryType: record.categoryType,
                        subCategory: record.subCategory,
                        type: record.type,
                        isPeriodic: record.isPeriodic,
                        duration: record.duration,
                        default: record.default,
                        modifiedOn: Date.now(),
                        modifiedBy: userId
                    }
                }
            }
        }));
        return await settingDB.bulkWrite(updateQuery);
    } else {
        const query = {
            _id: settingRecord._id,
            isDeleted: false
        };
        const queryPayload = {
            categoryName: settingRecord.categoryName,
            categoryDescription: settingRecord.categoryDescription,
            categoryType: settingRecord.categoryType,
            subCategory: settingRecord.subCategory,
            type: settingRecord.type,
            isPeriodic: settingRecord.isPeriodic,
            duration: settingRecord.duration,
            default: settingRecord.default
        };
        return await settingDB.findByIdAndUpdate(userId, query, queryPayload, null);
    }
}

export {
    isSettingAvailable,
    registerNewSetting,
    getAllSettings,
    getSettingInfoByLabel,
    getSettingInfoById,
    getSystemUserSettingInfo,
    getUserAssignableSettings,
    isRouteAvailable,
    isServiceAvailable,
    restoreRoute,
    isUserRoleAvailable,
    restoreRole,
    isUserRoleByIdAvailable,
    isDefaultUserRoleAvailable,
    getAllUserRole,
    getUserRoleById,
    updateUserRoleById,
    deleteUserRoleById,
    isScopeAvailable,
    getAllUserScope,
    getUserScopeById,
    updateUserScopeById,
    deleteUserScopeById,
    getAllAppRoute,
    getAppRouteById,
    updateAppRouteById,
    deleteAppRouteById,
    createUserSettings,
    getUserDashboardSetup,
    getDashboardSettingByUserId,
    updateUserDashboardSetting,
    updateSystemDashboardSetting
};
