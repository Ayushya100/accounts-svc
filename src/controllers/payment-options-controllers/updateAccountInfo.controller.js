'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-finance-service';
import { decryptPaymentData, encryptPaymentData } from '../../utils/payment.js';
import { translate } from '../../utils/i18n.js';

const header = 'controller: update-account-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const updateAccountInfo = async(userId, accountToken, payload) => {
    registerLog.createDebugLog('Start updating account info in system started');

    try {
        log.info('Execution for updating payment account info started');
        log.info('Execution for building account data started');
        if (payload.accountType) {
            payload.accountType = encryptPaymentData(String(payload.accountType.toUpperCase()), 'ACCOUNT');
        }
        if (payload.holderName) {
            payload.holderName = encryptPaymentData(String(payload.holderName), 'ACCOUNT');
        }
        log.info('Execution for building account data completed');

        log.info('Call db query to update account info');
        const updatedAccountInfo = await dbConnect.updateAccountByToken(userId, accountToken, payload);
        if (updatedAccountInfo) {
            const data = {
                userId: updatedAccountInfo.userId,
                token: updatedAccountInfo.token,
                accountType: decryptPaymentData(updatedAccountInfo.accountType, 'ACCOUNT'),
                holderName: decryptPaymentData(updatedAccountInfo.holderName, 'ACCOUNT'),
                amount: updatedAccountInfo.amount,
                isActive: updatedAccountInfo.isActive
            };

            log.info('Execution for updating payment account info in db completed successfully');
            return {
                resType: 'REQUEST_COMPLETED',
                resMsg: translate('paymentRoutes', 'Account updated successfully'),
                data: data,
                isValid: true
            };
        }
        
        log.error('Error while updating payment account info in database');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to update payment account info'),
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to update payment account info');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to update payment account info'),
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    updateAccountInfo
};
