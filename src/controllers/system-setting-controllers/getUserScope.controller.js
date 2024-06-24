'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-finance-service';
import { translate } from '../../utils/index.js';

const header = 'controller: get-user-scope-info';
const log = logger(header);

const getAllUserScope = async(roleId) => {
    try {
        log.info('Execution for retrieving all user scopes controller started');
        log.info('Call db query to get the details of all user scopes');
        const userScopeDetails = await dbConnect.getAllUserScope(roleId);

        if (userScopeDetails.length === 0) {
            log.info('No user scope available');
            return {
                resType: 'CONTENT_NOT_AVAILABLE',
                resMsg: translate('settingRoutes', 'No User scope records found'),
                data: [],
                isValid: true
            };
        }

        log.info('Execution for retrieving all user scope info completed successfully');
        return {
            resType: 'SUCCESS',
            resMsg: translate('settingRoutes', 'All user scopes found'),
            data: userScopeDetails,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to get all user scope records');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('settingRoutes', 'Some error occurred while working with db to retrieve user scope records'),
            stack: err.stack,
            isValid: false
        };
    }
}

const getUserScopeById = async(roleId, scopeId) => {
    try {
        log.info(`Execution for retrieving user scope info for provided scope id (${scopeId}) controller started`);
        log.info('Call db query to get the details of user scope for requested id');
        const userScopeDetails = await dbConnect.getUserScopeById(roleId, scopeId);

        if (!userScopeDetails || userScopeDetails.length === 0) {
            log.error('No information found for requested user scope');
            return {
                resType: 'NOT_FOUND',
                resMsg: translate('settingRoutes', 'User scope does not exists'),
                isValid: false
            };
        }

        log.success(`Execution for retrieving user scope info for provided scope id (${scopeId}) completed successfully`);
        return {
            resType: 'SUCCESS',
            resMsg: translate('settingRoutes', 'User Scope retrieved successfully'),
            data: userScopeDetails,
            isValid: true
        };
    } catch (err) {
        log.error(`Error while working with db to get user scope info for requested id : ${scopeId}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('settingRoutes', 'Some error occurred while working with db to retrieve the details of user scope for requested id'),
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    getAllUserScope,
    getUserScopeById
};
