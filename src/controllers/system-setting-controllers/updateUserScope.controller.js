'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-finance-service';

const header = 'controller: update-user-scope';
const log = logger(header);

const updatedUserScope = async(userId, scopeId, payload, scopeInfo) => {
    try {
        log.info('Execution for updating user scope info controller started');
        const queryPayload = {
            roleId: payload.roleId || scopeInfo.roleId,
            scope: payload.scope ? payload.scope.toUpperCase() : scopeInfo.scope,
            scopeDesc: payload.scopeDesc || scopeInfo.scopeDesc
        };

        log.info('Call db query to update user scope info');
        const userScopeDetails = await dbConnect.updateUserScopeById(userId, scopeId, queryPayload);

        log.info('Execution for updating user scope info completed successfully');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'User scope updated',
            data: userScopeDetails,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to updating user scope record');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to update user scope',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    updatedUserScope
};
