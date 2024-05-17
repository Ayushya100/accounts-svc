'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-finance-service';

const header = 'controller: create-user-scope';
const log = logger(header);

const isUserScopeAvailable = async(payload) => {
    try {
        log.info('Execution to check for existing user scope controller started');
        let response = {
            resType: 'SUCCESS',
            resMsg: 'VALIDATION SUCCESSFULL',
            isValid: true
        };

        log.info('Call db query to check for the existing records');
        const scopeDetails = await dbConnect.isScopeAvailable(payload);
        if (scopeDetails) {
            log.error(`Conflict, record already exists for requested user scope code : ${payload.scope}`);
            response.resType = 'CONFLICT';
            response.resMsg = 'User role already exists with same role code.';
            response.isValid = false;
        }

        log.info('Execution for checking existing record completed');
        return response;
    } catch (err) {
        log.error(`Error while working with db to check for existing user scope record : ${err}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to check for existing user scope record.',
            stack: err.stack,
            isValid: false
        };
    }
}

const createUserScope = async(payload) => {
    try {
        log.info('Execution for registering new user scope controller started');
        payload.scope = payload.scope.toUpperCase();

        log.info('Call db query to register new user scope in system');
        const newUserScope = await dbConnect.registerNewScope(payload);

        log.success('Execution for creating new record completed');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'User Role Created Successfully',
            data: newUserScope,
            isValid: true
        };
    } catch (err) {
        log.error(`Error while working with db to register new user scope record : ${err}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to register new user scope.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    isUserScopeAvailable,
    createUserScope
};
