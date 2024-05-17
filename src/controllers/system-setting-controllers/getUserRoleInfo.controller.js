'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-finance-service';

const header = 'controller: get-user-role-info';
const log = logger(header);

const getAllUserRole = async() => {
    try {
        log.info('Execution for retrieving all user roles info controller started');
        log.info('Call db query to get the details of all user roles');
        const userRoleDetails = await dbConnect.getAllUserRole();

        if (userRoleDetails.length === 0) {
            log.info('No user role info available');
            return {
                resType: 'CONTENT_NOT_AVAILABLE',
                resMsg: 'No User role records found',
                data: [],
                isValid: true
            };
        }

        log.info('Execution for retrieving all user role info completed successfully');
        return {
            resType: 'SUCCESS',
            resMsg: 'User roles found',
            data: userRoleDetails,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to get all user role records');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to retrieve user role records',
            stack: err.stack,
            isValid: false
        };
    }
}

const getUserRoleById = async(roleId) => {
    try {
        log.info(`Execution for retrieving user role info for provided role id (${roleId}) controller started`);
        log.info('Call db query to get the details of user role for requested id');
        const userRoleDetails = await dbConnect.getUserRoleById(roleId);

        if (!userRoleDetails || userRoleDetails.length === 0) {
            log.error('No information found for requested user role');
            return {
                resType: 'NOT_FOUND',
                resMsg: 'User role not found',
                isValid: false
            };
        }

        log.success(`Execution for retrieving user role info for provided role id (${roleId}) completed successfully`);
        return {
            resType: 'SUCCESS',
            resMsg: 'User Role retrieved successfully',
            data: userRoleDetails,
            isValid: true
        };
    } catch (err) {
        log.error(`Error while working with db to get user role info for requested id : ${roleId}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to retrieve record of user role for provided id',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    getAllUserRole,
    getUserRoleById
};
