'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-finance-service';

const header = 'controller: register-user-role';
const log = logger(header);

const isUserRoleAvailable = async(payload) => {
    try {
        log.info('Execution to check for existing user role controller started');
        let response = {
            resType: 'SUCCESS',
            resMsg: 'VALIDATION SUCCESSFULL',
            isValid: true
        };

        log.info('Call db query to check for the existing records');
        const routeDetails = await dbConnect.isUserRoleAvailable(payload);
        if (routeDetails) {
            log.error(`Conflict, record already exists for requested user role code : ${payload.roleCode}`);
            response.resType = 'CONFLICT';
            response.resMsg = 'User role already exists with same role code.';
            response.isValid = false;
        }

        log.info('Execution for checking existing record completed');
        return response;
    } catch (err) {
        log.error(`Error while working with db to check for existing user role record : ${err}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to check for existing user role record.',
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
        const newUserRole = await dbConnect.registerNewUserRole(payload);

        log.success('Execution for creating new record completed');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'User Role Created Successfully',
            data: newUserRole,
            isValid: true
        };
    } catch (err) {
        log.error(`Error while working with db to register new user role record : ${err}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to register new user role.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    isUserRoleAvailable,
    createUserRole
};
