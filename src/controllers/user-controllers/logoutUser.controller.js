'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-finance-service';
import { translate } from '../../utils/index.js';

const header = 'controller: logout-user-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const logoutUser = async(userId) => {
    registerLog.createDebugLog('Start operation to logout user');

    try {
        log.info('Execution for logging out user started');
        log.info('Call db query to delete tokens for user');
        await dbConnect.logoutUser(userId);

        log.info('Execution for logging out user completed');
        return {
            resType: 'SUCCESS',
            resMsg: translate('userRoutes', 'User LoggedOut Successfully'),
            data: null,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to logout user.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('userRoutes', 'Some error occurred while working with db to logout user'),
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    logoutUser
};
