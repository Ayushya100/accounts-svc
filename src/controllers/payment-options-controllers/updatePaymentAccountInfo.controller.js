'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-finance-service';
import {
    encryptPaymentData,
    decryptPaymentData,
    translate,
    maskUPINumber,
    maskPaymentNumber
} from '../../utils/index.js';

const header = 'controller: update-payment-account-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const formatResponse = (accountInfo) => {
    const fields = ['paymentName', 'paymentNumber'];
    for (const field of fields) {
        if (accountInfo[field]) {
            accountInfo[field] = decryptPaymentData(accountInfo[field], 'PAYMENT');
        }
    }

    if (accountInfo.paymentNumber) {
        accountInfo.paymentNumber = accountInfo.paymentType === 'UPI' ?
            maskUPINumber(accountInfo.paymentNumber) :
            maskPaymentNumber(accountInfo.paymentNumber);
    }
    return accountInfo;
}

const updatePaymentAccountInfo = async(userId, accountToken, payload) => {
    registerLog.createDebugLog('Start updating payment account info in system started');

    try {
        log.info('Execution for updating payment mode account info started');
        log.info('Execution for building account data started');
        const accountPayload = {
            paymentNumber: encryptPaymentData(String(payload.paymentNumber), 'PAYMENT')
        };

        log.info('Call db query to update payment mode account data completed');
        let updatedPaymentAccountInfo = await dbConnect.updatePaymentAccountByToken(userId, accountToken, accountPayload);
        if (updatedPaymentAccountInfo) {
            updatedPaymentAccountInfo = formatResponse(updatedPaymentAccountInfo);
            const data = {
                userId: updatedPaymentAccountInfo.userId,
                token: updatedPaymentAccountInfo.token,
                paymentName: updatedPaymentAccountInfo.paymentName,
                paymentNumber: updatedPaymentAccountInfo.paymentNumber,
                paymentType: updatedPaymentAccountInfo.paymentType
            };

            log.info('Execution for updating payment mode account info in db completed successfully');
            return {
                resType: 'REQUEST_ACCEPTED',
                resMsg: translate('paymentRoutes', 'Payment mode Account updated successfully'),
                data: data,
                isValid: true
            };
        }

        log.error('Error while updating payment mode account info in database');
        return {
            resType: 'NOT_FOUND',
            resMsg: translate('paymentRoutes', 'Payment mode Account not found to update information'),
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to update payment mode account info');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to update payment mode account info'),
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    updatePaymentAccountInfo
};
