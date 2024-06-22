'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-finance-service';
import { translate } from '../../utils/i18n.js';

const header = 'controller: shared-account-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const checkAccountByToken = async(userId, accountToken) => {
    registerLog.createInfoLog('Start checking if account with provided account token is available');

    try {
        log.info('Execution for checking if account with provided account token started');
        log.info('Call db query to get the existing account information from the database');
        const isAccountAvailable = await dbConnect.isAccountByTokenAvailable(userId, accountToken);

        if (isAccountAvailable) {
            return {
                resType: 'SUCCESS',
                resMsg: translate('paymentRoutes', 'Account Information available'),
                isValid: true
            };
        }

        log.info('No Account information available for provided account token');
        return {
            resType: 'NOT_FOUND',
            resMsg: translate('paymentRoutes', 'No Account Information available for provided account token for account task creation'),
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to check for existing account with provided account token');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to check for existing account with provided account token'),
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    checkAccountByToken
};
