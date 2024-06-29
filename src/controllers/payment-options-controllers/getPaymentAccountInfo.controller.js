'use strict';

import { logger, createNewLog } from 'lib-finance-service';
import dbConnect from '../../db/index.js';
import {
    decryptPaymentData,
    filterFields,
    maskPaymentNumber,
    maskUPINumber,
    translate
} from '../../utils/index.js';

const header = 'controller: get-payment-account-info';

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

const getAllPaymentAccount = async(userId, filterOptions) => {
    registerLog.createDebugLog('Start retrieving all payment account info for requested user');

    try {
        log.info('Execution for retrieving user payment account informations started');
        const accountFields = filterOptions ? filterFields(filterOptions) : null;

        log.info('Call db query to retrieve all user payment accounts');
        let userPaymentAccounts = await dbConnect.getAllUserPaymentAccount(userId, accountFields);

        if (userPaymentAccounts.length > 0) {
            log.info('Data format into readable format started');
            userPaymentAccounts.forEach(accountInfo => {
                accountInfo = formatResponse(accountInfo);
            });

            log.info('Execution for retrieving user payment account information retrieved successfully');
            return {
                resType: 'SUCCESS',
                resMsg: translate('paymentRoutes', 'User payment account information retrieved successfully'),
                data: userPaymentAccounts,
                isValid: true
            };
        }

        log.info('No user payment account information found');
        return {
            resType: 'CONTENT_NOT_AVAILABLE',
            resMsg: translate('paymentRoutes', 'No payment account information found'),
            isValid: true
        };
    } catch (err) {
        log.error(`Error while working with db for retrieveing all payment account info for requested user : ${userId}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to retrieve all payment account info for requested user'),
            stack: err.stack,
            isValid: false
        };
    }
}

const getPaymentAccountByToken = async(userId, accountToken, filterOptions) => {
    registerLog.createDebugLog('Start retrieving account info for requested account token');

    try {
        log.info('Execution for retrieving account information started');
        const accountFields = filterOptions ? filterFields(filterOptions) : null;

        log.info('Call db query to retrieve payment account information started');
        let paymentAccount = await dbConnect.getPaymentAccountByToken(userId, accountToken, accountFields);
        
        if (paymentAccount) {
            log.info('Data format into readable format started');
            paymentAccount = formatResponse(paymentAccount);

            log.info('Execution for retrieving payment account information retrieved successfully');
            return {
                resType: 'SUCCESS',
                resMsg: translate('paymentRoutes', 'User payment account information retrieved successfully'),
                data: paymentAccount,
                isValid: true
            };
        }

        log.error('No user payment account information found');
        return {
            resType: 'NOT_FOUND',
            resMsg: translate('paymentRoutes', 'No payment account information found'),
            isValid: false
        };
    } catch (err) {
        log.error(`Error while working with db for retrieveing payment account info for requested account`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to retrieve payment account info for requested account token'),
            stack: err.stack,
            isValid: false
        };
    }
}

const getPaymentAccountByPaymentType = async(userId, paymentType, filterOptions) => {
    registerLog.createDebugLog('Start retrieving payment account info for requested payment type');

    try {
        log.info('Execution for retrieving user payment account information started');
        const validFields = ['CASH', 'UPI', 'WALLET', 'INTERNET-BANKING', 'MOBILE-BANKING', 'CHEQUE', 'DEMAND-DRAFT'];
        paymentType = paymentType.toUpperCase();
        if (!validFields.includes(paymentType)) {
            return {
                resType: 'BAD_REQUEST',
                resMsg: translate('paymentRoutes', 'Invalid payment type'),
                isValid: false
            };
        }

        const accountFields = filterOptions ? filterFields(filterOptions) : null;

        log.info('Call db query to retrieve user payment accounts for requested payment type');
        let paymentAccount = await dbConnect.getPaymentAccountByType(userId, paymentType, accountFields);

        if (paymentAccount.length > 0) {
            log.info('Data format into readable format started');
            paymentAccount.forEach(accountInfo => {
                accountInfo = formatResponse(accountInfo);
            });

            log.info('Execution for retrieving user payment account information retrieved successfully');
            return {
                resType: 'SUCCESS',
                resMsg: translate('paymentRoutes', 'User account information retrieved successfully'),
                data: paymentAccount,
                isValid: true
            };
        }

        log.info('No user payment account information found');
        return {
            resType: 'CONTENT_NOT_AVAILABLE',
            resMsg: translate('paymentRoutes', 'No payment account information found'),
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to retrieve payment account info for requested accounts by type');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to retrieve account info for requested account type'),
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    getAllPaymentAccount,
    getPaymentAccountByToken,
    getPaymentAccountByPaymentType
};
