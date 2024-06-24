'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-finance-service';
import { translate } from '../../utils/index.js';

const header = 'controller: register-user-role';
const log = logger(header);

const isUserRoleAvailable = async(payload) => {
    try {
        log.info('Execution to check for existing user role controller started');
        let response = {
            resType: 'REQUEST_COMPLETED',
            resMsg: translate('settingRoutes', 'VALIDATION SUCCESSFULL'),
            data: null,
            isValid: true
        };

        log.info('Call db query to check for the existing user role record');
        const roleDetails = await dbConnect.isUserRoleAvailable(payload);

        if (roleDetails && !roleDetails.isDeleted) {
            log.error(`Conflict, record already exists for requested user role code : ${payload.roleCode}`);
            response.resType = 'CONFLICT';
            response.resMsg = translate('settingRoutes', 'User role already exists with same role code');
            response.isValid = false;
        } else if (roleDetails && roleDetails.isDeleted) {
            log.error(`Role already exists but is deleted, need to restore or update the role with provided code`);
            response.resType = 'SUCCESS';
            response.resMsg = translate('settingRoutes', 'User Role already exists but is deleted');
            response.data = roleDetails;
            response.isValid = false;
        }

        log.info('Execution for checking existing user role record completed');
        return response;
    } catch (err) {
        log.error(`Error while working with db to check for existing user role record : ${err}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('settingRoutes', 'Some error occurred while working with db to check for existing user role record'),
            stack: err.stack,
            isValid: false
        };
    }
}

const createUserRole = async(payload) => {
    try {
        log.info('Execution for registering new user role controller started');
        payload.roleCode = payload.roleCode.toUpperCase();

        log.info('Call db query to register new user role in system');
        const newUserRole = await dbConnect.createNewRole(payload);

        log.success('Execution for creating new record completed');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: translate('settingRoutes', 'User Role Created Successfully'),
            data: newUserRole,
            isValid: true
        };
    } catch (err) {
        log.error(`Error while working with db to register new user role record : ${err}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('settingRoutes', 'Some error occurred while working with db to register new user role'),
            stack: err.stack,
            isValid: false
        };
    }
}

const restoreRole = async(userId, role) => {
    try {
        log.info('Execution for restoring deleted role controller started');
        log.info('Call db query to restore deleted role');
        const updatedRole = await dbConnect.restoreRole(userId, role);

        log.success('Execution for restoring deleted role record completed');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: translate('settingRoutes', 'Role Restored Successfully'),
            data: updatedRole,
            isValid: true
        };
    } catch (err) {
        log.error(`Error while working with db to restore deleted role record : ${err}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('settingRoutes', 'Some error occurred while working with db to restore deleted role'),
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    isUserRoleAvailable,
    createUserRole,
    restoreRole
};
