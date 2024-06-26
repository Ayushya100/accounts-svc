'use strict';

import { logger, createNewLog } from 'lib-finance-service';
import dbConnect from '../../db/index.js';
import {
    convertFullDateToString,
    decryptPaymentData,
    filterFields,
    maskPaymentNumber,
    translate
} from '../../utils/index.js';

const header = 'controller: get-account-info';

const log = logger(header);
const registerLog = createNewLog(header);

const formatResponse = (accountInfo) => {
    const fields = ['accountName', 'accountNumber', 'accountType', 'accountDate', 'holderName'];
    for (const field of fields) {
        if (accountInfo[field]) {
            accountInfo[field] = decryptPaymentData(accountInfo[field], 'ACCOUNT');
        }
    }
    
    if (accountInfo.accountNumber) {
        accountInfo.accountNumber = maskPaymentNumber(accountInfo.accountNumber);
    }
    
    if (accountInfo.accountDate) {
        accountInfo.accountDate = convertFullDateToString(accountInfo.accountDate);
    }
    return accountInfo;
}

const getAllUserAccount = async(userId, filterOptions) => {
    registerLog.createDebugLog('Start retrieving all account info for requested user');

    try {
        log.info('Execution for retrieving user account informations started');
        const accountFields = filterOptions ? filterFields(filterOptions) : null;

        log.info('Call db query to retrieve all user accounts');
        let userAccounts = await dbConnect.getAllUserAccount(userId, accountFields);

        if (userAccounts.length > 0) {
            log.info('Data format into readable format started');
            userAccounts.forEach(accountInfo => {
                accountInfo = formatResponse(accountInfo);
            });

            log.info('Execution for retrieving user account information retrieved successfully');
            return {
                resType: 'SUCCESS',
                resMsg: translate('paymentRoutes', 'User account information retrieved successfully'),
                data: userAccounts,
                isValid: true
            };
        }

        log.info('No user account information found');
        return {
            resType: 'CONTENT_NOT_AVAILABLE',
            resMsg: translate('paymentRoutes', 'No account information found'),
            isValid: true
        };
    } catch (err) {
        log.error(`Error while working with db for retrieveing all account info for requested user : ${userId}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to retrieve all account info for requested user'),
            stack: err.stack,
            isValid: false
        };
    }
}

const getUserAccountByToken = async(userId, accountToken, filterOptions) => {
    registerLog.createDebugLog('Start retrieving all account info for requested user');

    try {
        log.info('Execution for retrieving user account information started');
        const accountFields = filterOptions ? filterFields(filterOptions) : null;

        log.info('Call db query to retrieve user account for requtested token');
        let userAccount = await dbConnect.getUserAccountByToken(userId, accountToken, accountFields);

        if (userAccount) {
            log.info('Data format into readable format started');
            userAccount = formatResponse(userAccount);

            log.info('Execution for retrieving user account information retrieved successfully');
            return {
                resType: 'SUCCESS',
                resMsg: translate('paymentRoutes', 'User account information retrieved successfully'),
                data: userAccount,
                isValid: true
            };
        }

        log.error('No user account information found');
        return {
            resType: 'NOT_FOUND',
            resMsg: translate('paymentRoutes', 'No account information found'),
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to retrieve account info for requested account by token');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to retrieve account info for requested account'),
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    getAllUserAccount,
    getUserAccountByToken
};
