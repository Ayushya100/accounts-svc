'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-finance-service';
import { translate } from '../../utils/index.js';

const deactivateAccount = async(userId, accountToken) => {
    const header = 'controller: deactivate-account-controller';
    const log = logger(header);
    const registerLog = createNewLog(header);
    registerLog.createDebugLog('Start deactivating account in system started');

    try {
        log.info('Execution for deactivating payment account started');
        log.info('Call db query to deactivate account info');
        const updatedAccountInfo = await dbConnect.deactivateReactivateAccountByToken(userId, accountToken, false);
        if (updatedAccountInfo) {
            log.info('Execution for deactivating payment account info in db completed successfully');
            return {
                resType: 'REQUEST_ACCEPTED',
                resMsg: translate('paymentRoutes', 'Account deactivated successfully'),
                data: updatedAccountInfo,
                isValid: true
            };
        }

        log.error('Error while deactivating payment account info in database');
        return {
            resType: 'NOT_FOUND',
            resMsg: translate('paymentRoutes', 'Account not found to deactivate'),
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to deactivate payment account info');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to deactivate payment account info'),
            stack: err.stack,
            isValid: false
        };
    }
}

const reactivateAccount = async(userId, accountToken) => {
    const header = 'controller: reactivate-account-controller';
    const log = logger(header);
    const registerLog = createNewLog(header);
    registerLog.createDebugLog('Start reactivating account in system started');

    try {
        log.info('Execution for reactivating payment account started');
        log.info('Call db query to reactivate account info');
        const updatedAccountInfo = await dbConnect.deactivateReactivateAccountByToken(userId, accountToken, true);
        if (updatedAccountInfo) {
            log.info('Execution for reactivating payment account info in db completed successfully');
            return {
                resType: 'REQUEST_ACCEPTED',
                resMsg: translate('paymentRoutes', 'Account reactivated successfully'),
                data: updatedAccountInfo,
                isValid: true
            };
        }

        log.error('Error while reactivating payment account info in database');
        return {
            resType: 'NOT_FOUND',
            resMsg: translate('paymentRoutes', 'Account not found to reactivate'),
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to deactivate payment account info');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to reactivate payment account info'),
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    deactivateAccount,
    reactivateAccount
};
