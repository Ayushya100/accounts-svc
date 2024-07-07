'use strict';

import mongoose from 'mongoose';

// Import DB Templates
import {
    dashboardSettingTemplate,
    roleScopeTemplate,
    serviceConfigTemplate,
    serviceRoutesTemplate,
    userRoleTemplate
} from 'lib-finance-service';

const routeDB = new serviceRoutesTemplate();
const settingDB = new dashboardSettingTemplate();
const roleDB = new userRoleTemplate();
const scopeDB = new roleScopeTemplate();
const configDB = new serviceConfigTemplate();

const findRouteById = async(routeId) => {
    const query = {
        _id: routeId
    };
    return await routeDB.findById(query, null);
}

const createNewRoute = async(route) => {
    return await routeDB.create(route);
}

const findConfigById = async(configId) => {
    const query = {
        _id: configId
    };
    return await configDB.findById(query, null);
}

const createNewConfig = async(config) => {
    return await configDB.create(config);
}

const findRoleById = async(roleId) => {
    const query = {
        _id: roleId
    };
    return await roleDB.findById(query, null);
}

const createNewRole = async(role) => {
    return await roleDB.create(role);
}

const findScopeById = async(scopeId) => {
    const query = {
        _id: scopeId
    };
    return await scopeDB.findById(query, null);
}

const createNewScope = async(scope) => {
    return await scopeDB.create(scope);
}

const findSettingById = async(settingId) => {
    const query = {
        _id: settingId
    };
    return await settingDB.findById(query, null);
}

const createNewSetting = async(setting) => {
    return await settingDB.create(setting);
}

export {
    findRouteById,
    createNewRoute,
    findRoleById,
    createNewRole,
    findScopeById,
    createNewScope,
    findSettingById,
    createNewSetting,
    findConfigById,
    createNewConfig
};
