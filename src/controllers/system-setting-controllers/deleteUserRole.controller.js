'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-finance-service';

const header = 'controller: delete-user-role';
const log = logger(header);

const deleteUserRole = async(userId, roleId) => {
    try {
        log.info('Execution for deleting user role controller started');
        log.info('Call db query to delete user role from db');
        const userRoleDetails = await dbConnect.deleteUserRoleById(userId, roleId);
        
        log.info('Execution for deleting user role completed successfully');
        return {
            resType: 'REQUEST_ACCEPTED',
            resMsg: 'User role info deleted',
            data: userRoleDetails,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to delete user role record');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to delete user role.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    deleteUserRole
};
