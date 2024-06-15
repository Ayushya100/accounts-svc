'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-finance-service';

const header = 'controller: delete-user-scope';
const log = logger(header);

const deleteUserScope = async(userId, roleId, scopeId) => {
    try {
        log.info('Execution for deleting user scope controller started');
        log.info('Call db query to delete user scope from db');
        const userScopeDetails = await dbConnect.deleteUserScopeById(userId,  roleId, scopeId);

        log.info('Execution for deleting user scope completed successfully');
        return {
            resType: 'REQUEST_ACCEPTED',
            resMsg: 'User scope deleted successfully',
            data: userScopeDetails,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to delete user scope');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to delete user scope',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    deleteUserScope
};
