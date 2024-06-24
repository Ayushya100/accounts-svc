'use strict';

import dbConnect from '../../db/index.js';
import { createNewLog, logger } from 'lib-finance-service';
import { translate } from '../../utils/index.js';

const header = 'controller: shared-user-controller';

const log = logger(header);
// const registerLog = createNewLog(header);

const checkUserById = async(userId) => {
    // registerLog.createDebugLog('Start checking if user is available');

    try {
        log.info(`Execution for checking the existense of user for provided id (${userId}) started`);
        log.info('Call db query to check for the existing record');
        const isUserAvailable = await dbConnect.isUserByIdAvailable(userId);
        if (isUserAvailable) {
            log.info('Execution for checking existing user record completed');
            return {
                resType: 'SUCCESS',
                resMsg: translate('userRoutes', 'VALIDATION SUCCESSFUL'),
                data: isUserAvailable,
                isValid: true
            };
        }

        log.error('No user found');
        return {
            resType: 'NOT_FOUND',
            resMsg: translate('userRoutes', 'User not found'),
            data: null,
            isValid: false
        };
    } catch (err) {
        log.error(`Error while working with db to check for existing user for provided id : ${userId}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('userRoutes', 'Some error occurred while checking for existing user record for provided id'),
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    checkUserById
};
