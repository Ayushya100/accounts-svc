'use strict';

import dbConnect from '../../db/index.js';
import { readJsonFileSync } from '../../utils/index.js';
import { logger } from 'lib-finance-service';
import { translate } from '../../utils/index.js';

const header = 'controller: sync-system-setup';

const log = logger(header);

const processServiceRoutesSync = async() => {
    try {
        log.info('Execution for syncing service routes controller started');
        const serviceRoutes = readJsonFileSync('service_routes');

        for (const routes of serviceRoutes) {
            const existingRoute = await dbConnect.findRouteById(routes._id);
            if (!existingRoute) {
                dbConnect.createNewRoute(routes);
            }
        }

        log.success('Execution for syncing service routes completed successfully');
        return {
            resType: 'SUCCESS',
            resMsg: translate('setupRoutes', 'Service routes sync completed successfully'),
            data: serviceRoutes,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to sync service routes.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('setupRoutes', 'Some error occurred while working with db to sync service routes'),
            stack: err.stack,
            isValid: false
        };
    }
}

const processServiceConfigsSync = async() => {
    try {
        log.info('Execution for syncing service configs controller started');
        const serviceConfigs = readJsonFileSync('service_configs');

        for (const configs of serviceConfigs) {
            const existingConfig = await dbConnect.findConfigById(configs._id);
            if (!existingConfig) {
                dbConnect.createNewConfig(configs);
            }
        }

        log.success('Execution for syncing service configs completed successfully');
        return {
            resType: 'SUCCESS',
            resMsg: translate('setupRoutes', 'Service configs sync completed successfully'),
            data: serviceConfigs,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to sync service configs.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('setupRoutes', 'Some error occurred while working with db to sync service configs'),
            stack: err.stack,
            isValid: false
        };
    }
}

const processUserRoleSync = async() => {
    try {
        log.info('Execution for syncing user roles controller started');
        const userRoles = readJsonFileSync('user_roles');

        for (const role of userRoles) {
            const existingRole = await dbConnect.findRoleById(role._id);
            if (!existingRole) {
                dbConnect.createNewRole(role);
            }
        }

        log.success('Execution for syncing user roles completed successfully');
        return {
            resType: 'SUCCESS',
            resMsg: translate('setupRoutes', 'User roles sync completed successfully'),
            data: userRoles,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to sync user roles.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('setupRoutes', 'Some error occurred while working with db to sync user roles'),
            stack: err.stack,
            isValid: false
        };
    }
}

const processRoleScopeSync = async() => {
    try {
        log.info('Execution for syncing role scopes controller started');
        const roleScopes = readJsonFileSync('role_scopes');

        for (const scope of roleScopes) {
            const existingScope = await dbConnect.findScopeById(scope._id);
            if (!existingScope) {
                dbConnect.createNewScope(scope);
            }
        }

        log.success('Execution for syncing role scopes completed successfully');
        return {
            resType: 'SUCCESS',
            resMsg: translate('setupRoutes', 'Role scopes sync completed successfully'),
            data: roleScopes,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to sync role scopes.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('setupRoutes', 'Some error occurred while working with db to sync role scopes'),
            stack: err.stack,
            isValid: false
        };
    }
}

const processDashboardSettingsSync = async() => {
    try {
        log.info('Execution for syncing dashboard settings controller started');
        const dashboardSettings = readJsonFileSync('dashboard_settings');

        for (const setting of dashboardSettings) {
            const existingSetting = await dbConnect.findSettingById(setting._id);
            if (!existingSetting) {
                dbConnect.createNewSetting(setting);
            }
        }

        log.success('Execution for syncing dashboard settings completed successfully');
        return {
            resType: 'SUCCESS',
            resMsg: translate('setupRoutes', 'Dashboard settings sync completed successfully'),
            data: dashboardSettings,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to sync dashboard settings.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('setupRoutes', 'Some error occurred while working with db to sync dashboard settings'),
            stack: err.stack,
            isValid: false
        };
    }
}

const syncSetup = async() => {
    try {
        log.info('Execution for syncing default setup controller started');
        let message = `${translate('setupRoutes', 'Setup sync completed successfully for')} `;
        
        log.info('Call function to sync service routes');
        const serviceRoutesResponse = await processServiceRoutesSync();
        if (serviceRoutesResponse.isValid) {
            message += `${translate('setupRoutes', 'service routes')}`;
        }

        log.info('Call function to sync service configs');
        const serviceConfigsResponse = await processServiceConfigsSync();
        if (serviceConfigsResponse.isValid) {
            message += `${translate('setupRoutes', 'service configs')}`
        }

        log.info('Call function to sync user roles');
        const userRolesResponse = await processUserRoleSync();
        if (userRolesResponse.isValid) {
            message += `, ${translate('setupRoutes', 'user roles')}`;
        }

        log.info('Call function to sync user roles');
        const roleScopesResponse = await processRoleScopeSync();
        if (roleScopesResponse.isValid) {
            message += `, ${translate('setupRoutes', 'role scopes')}`;
        }

        log.info('Call function to sync dashboard setup');
        const dashboardSettingsResponse = await processDashboardSettingsSync();
        if (dashboardSettingsResponse.isValid) {
            message += `, ${translate('setupRoutes', 'and dashboard settings')}`;
        }

        log.info('Execution for syncing default setup execution completed');
        return {
            resType: 'SUCCESS',
            resMsg: message,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to sync system setup.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to sync system setup',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    syncSetup
};
