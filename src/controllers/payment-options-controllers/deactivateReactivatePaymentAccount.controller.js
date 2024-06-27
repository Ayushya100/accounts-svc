'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-finance-service';
import { translate } from '../../utils/index.js';

const deactivatePaymentAccount = async(userId, accountToken) => {
    const header = 'controller: deactivate-payment-account-controller';
    const log = logger(header);
    const registerLog = createNewLog(header);
    registerLog.createDebugLog('Start deactivating payment account in system started');

    try {
        log.info('Execution for deactivating payment mode account started');
        log.info('Call db query to deactivate payment mode account info');
        const updatedAccountInfo = await dbConnect.deactivateReactivatePaymentAccountByToken(userId, accountToken, false);
        if (updatedAccountInfo) {
            log.info('Execution for deactivating payment mode account in db completed successfully');
            return {
                resType: 'REQUEST_ACCEPTED',
                resMsg: translate('paymentRoutes', 'Account deactivated successfully'),
                data: updatedAccountInfo,
                isValid: true
            }
        }

        log.error('Error while deactivating payment mode account in db');
        return {
            resType: 'NOT_FOUND',
            resMsg: translate('paymentRoutes', 'Payment mode account not found to deactivate'),
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to deactivate payment mode account info');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to deactivate payment mode account'),
            stack: err.stack,
            isValid: false
        };
    }
}

const reactivatePaymentAccount = async(userId, accountToken) => {
    const header = 'controller: reactivate-payment-account-controller';
    const log = logger(header);
    const registerLog = createNewLog(header);
    registerLog.createDebugLog('Start reactivating payment account in system started');

    try {
        log.info('Execution for reactivating payment mode account started');
        log.info('Call db query to reactivate payment mode account info');
        const updatedAccountInfo = await dbConnect.deactivateReactivatePaymentAccountByToken(userId, accountToken, true);
        if (updatedAccountInfo) {
            log.info('Execution for reactivating payment mode account in db completed successfully');
            return {
                resType: 'REQUEST_ACCEPTED',
                resMsg: translate('paymentRoutes', 'Account reactivated successfully'),
                data: updatedAccountInfo,
                isValid: true
            }
        }

        log.error('Error while reactivating payment mode account in db');
        return {
            resType: 'NOT_FOUND',
            resMsg: translate('paymentRoutes', 'Payment mode account not found to reactivate'),
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to reactivate payment account info');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to reactivate payment mode account info'),
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    deactivatePaymentAccount,
    reactivatePaymentAccount
};
