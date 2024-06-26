'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-finance-service';
import {
    maskUPINumber,
    decryptPaymentData,
    encryptPaymentData,
    generatePaymentToken,
    generateRandomNumberForToken,
    maskPaymentNumber,
    translate
} from '../../utils/index.js';

const header = 'controller: register-payment-option-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const checkPaymentOptionAccount = async(userId, accountId, payload) => {
    registerLog.createDebugLog('Start checking if payment options with provided payment details is available');

    try {
        log.info('Execution for checking for existing payment option account with provided account details started');
        let response = {
            resType: 'SUCCESS',
            resMsg: 'VALIDATION SUCCESSFULL',
            isValid: true
        };
        const paymentType = payload.paymentType.toUpperCase();
        let query;

        if (paymentType === 'CASH') {
            query = {
                userId: userId,
                paymentType: paymentType,
                isDeleted: false
            };
        } else if (paymentType === 'WALLET') {
            query = {
                userId: userId,
                paymentName: encryptPaymentData(payload.paymentName, 'PAYMENT'),
                paymentType: paymentType,
                isDeleted: false
            };
        } else if (paymentType === 'UPI' || paymentType === 'INTERNET-BANKING' || paymentType === 'MOBILE-BANKING') {
            query = {
                paymentName: encryptPaymentData(payload.paymentName, 'PAYMENT'),
                paymentNumber: encryptPaymentData(payload.paymentNumber, 'PAYMENT'),
                paymentType: paymentType,
                isDeleted: false
            };
        } else {
            query = {
                userId: userId,
                accountId: accountId,
                paymentName: encryptPaymentData(payload.paymentName, 'PAYMENT'),
                isDeleted: false
            };
        }

        log.info('Call db query to get the existing payment option account information from the database');
        const isPaymentOptionAvailable = await dbConnect.isPaymentOptionAvailable(query);
        if (isPaymentOptionAvailable) {
            response.resType = 'CONFLICT';
            response.resMsg = translate('paymentRoutes', 'Payment Account already exists with same account information');
            response.isValid = false;
        }

        log.info('Execution for checking for existing payment option account details completed');
        return response;
    } catch (err) {
        log.error('Error while working with db to check for existing payment option record with provided account information');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to check for existing payment option account with provided account details'),
            stack: err.stack,
            isValid: false
        };
    }
}

const registerPaymentOptionAccount = async(userId, accountId, payload) => {
    registerLog.createDebugLog('Start creating new payment option account in system started');

    try {
        log.info('Execution for creating new payment option account started');
        let userEnding = userId.slice(-5);
        let accountEnding = accountId ? String(accountId).slice(-5) : '';
        const tokenKey = payload.paymentNumber ? 
            `${userEnding}${payload.paymentNumber}${accountEnding}` : 
            `${userEnding}${generateRandomNumberForToken()}${accountEnding}`;
        const token = generatePaymentToken(String(tokenKey), 'PAYMENT');

        const paymentType = payload.paymentType.toUpperCase();
        let accountPayload = {
            userId: userId,
            token: token,
            paymentType: paymentType
        };

        if (paymentType === 'CASH') {
            accountPayload.paymentName = encryptPaymentData('CASH', 'PAYMENT');
        } else if (paymentType === 'WALLET') {
            accountPayload.paymentName = encryptPaymentData(payload.paymentName, 'PAYMENT');
            accountPayload.paymentNumber = payload.paymentNumber || null;
        } else if (paymentType === 'UPI' || paymentType === 'INTERNET-BANKING' || paymentType === 'MOBILE-BANKING') {
            accountPayload.accountId = accountId;
            accountPayload.paymentName = encryptPaymentData(payload.paymentName, 'PAYMENT');
            accountPayload.paymentNumber = encryptPaymentData(payload.paymentNumber, 'PAYMENT');
        } else {
            accountPayload.accountId = accountId;
            accountPayload.paymentName = encryptPaymentData(payload.paymentName, 'PAYMENT');
        }

        log.info('Call db query to create new payment account');
        const paymentAccount = await dbConnect.createPaymentAccount(accountPayload);
        if (paymentAccount) {            
            const data = {
                token: paymentAccount.token,
                paymentType: paymentAccount.paymentType,
                paymentName: decryptPaymentData(String(paymentAccount.paymentName), 'PAYMENT'),
                paymentNumber: paymentAccount.paymentNumber ? paymentAccount.paymentType === 'UPI' ? 
                    maskUPINumber(decryptPaymentData(paymentAccount.paymentNumber, 'PAYMENT')) :
                    maskPaymentNumber(decryptPaymentData(paymentAccount.paymentNumber, 'PAYMENT')) : 
                    null,
                balance: paymentAccount.balance,
                isActive: paymentAccount.isActive
            };

            log.info('Execution for registering new payment option account in db completed successfully');
            return {
                resType: 'REQUEST_COMPLETED',
                resMsg: translate('paymentRoutes', 'Payment method added successfully'),
                data: data,
                isValid: true
            };
        }

        log.error('Error while creating new payment option in database');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to create new payment option account'),
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to create new payment option account');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to create new payment option account'),
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    checkPaymentOptionAccount,
    registerPaymentOptionAccount
};
