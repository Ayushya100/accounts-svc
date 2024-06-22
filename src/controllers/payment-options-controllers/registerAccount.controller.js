'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-finance-service';
import {
    convertFullDateToString,
    decryptPaymentData,
    encryptPaymentData,
    generatePaymentToken,
    maskPaymentNumber,
    translate
} from '../../utils/index.js';

const header = 'controller: register-account-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const checkAccountByAccNumber = async(accountNumber) => {
    registerLog.createInfoLog('Start checking if account with provided account number is available');

    try {
        log.info('Execution for checking if account with provided account number started');
        let response = {
            resType: 'SUCCESS',
            resMsg: 'VALIDATION SUCCESSFULL',
            isValid: true
        };

        const encryptedAccountNumber = encryptPaymentData(accountNumber, 'ACCOUNT');
        log.info('Call db query to get the existing account information from the database');
        const isAccountAvailable = await dbConnect.isAccountByAccNumberAvailable(encryptedAccountNumber);
        
        if (isAccountAvailable) {
            response.resType = 'CONFLICT';
            response.resMsg = translate('paymentRoutes', 'Account already exists with same account number');
            response.isValid = false;
        }

        log.info('Execution for checking existing account for provided account number completed');
        return response;
    } catch (err) {
        log.error('Error while working with db to check for existing account with provided account number.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to check for existing account with provided account number'),
            stack: err.stack,
            isValid: false
        };
    }
}

const registerAccount = async(userId, payload) => {
    registerLog.createInfoLog('Start creating new payment account in system started');

    try {
        log.info('Execution for creating new payment account started');
        log.info('Execution for building account data started');
        payload.token = generatePaymentToken(String(payload.accountName), 'ACCOUNT');

        payload.accountName = encryptPaymentData(String(payload.accountName), 'ACCOUNT');
        payload.accountNumber = encryptPaymentData(String(payload.accountNumber), 'ACCOUNT');
        payload.accountType = encryptPaymentData(String(payload.accountType.toUpperCase()), 'ACCOUNT');

        payload.accountDate = new Date(payload.accountDate);
        payload.accountDate = encryptPaymentData(String(payload.accountDate), 'ACCOUNT');
        payload.holderName = encryptPaymentData(String(payload.holderName), 'ACCOUNT');
        log.info('Execution for building account data completed');

        log.info('Call db query to create new account');
        const newAccount = await dbConnect.createAccount(userId, payload);
        if (newAccount) {
            const data = {
                token: newAccount.token,
                accountName: decryptPaymentData(newAccount.accountName, 'ACCOUNT'),
                accountNumber: maskPaymentNumber(decryptPaymentData(newAccount.accountNumber, 'ACCOUNT')),
                accountType: decryptPaymentData(newAccount.accountType, 'ACCOUNT'),
                accountDate: convertFullDateToString(decryptPaymentData(newAccount.accountDate, 'ACCOUNT')),
                holderName: decryptPaymentData(newAccount.holderName, 'ACCOUNT')
            };
            return {
                resType: 'REQUEST_COMPLETED',
                resMsg: translate('paymentRoutes', 'Account created successfully'),
                data: data,
                isValid: true
            };
        }

        log.error('Error while creating new payload account in database');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to create new payment account'),
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to create new payment account.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to create new payment account'),
            stack: err.stack,
            isValid: false
        };
    }
}

const createTask = async(userId, accountInfo, taskPayload) => {
    registerLog.createInfoLog('Start creating new payment account task started');

    try {
        log.info('Execution for creating new account task started');
        const payload = {
            userId: userId,
            debitFrom: taskPayload.debitFrom,
            creditTo: accountInfo.token,
            taskType: taskPayload.taskType,
            duration: taskPayload.duration.toUpperCase(),
            durationCount: taskPayload.durationCount,
            interestApplicable: taskPayload.interestApplicable,
            interestRate: taskPayload.interestApplicable ? taskPayload.interestRate : 0,
            startDate: new Date(taskPayload.startDate),
            endDate: taskPayload.endDate || null,
            afterEndDepositTo: taskPayload.afterEndDepositTo ? taskPayload.afterEndDepositTo : null,
            nextDepositDate: taskPayload.nextDepositDate
        };

        log.info('Call db query to create new account task');
        const newTask = await dbConnect.createTask(payload);
        if (newTask) {
            return {
                resType: 'REQUEST_COMPLETED',
                resMsg: translate('paymentRoutes', 'Task created successfully'),
                data: newTask,
                isValid: true
            };
        }

        log.error('Error while creating new account task in database');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to create new account task'),
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to create new account task.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to create new account task'),
            stack: err.stack,
            isValid: false
        };
    }
}

const sendAccountCreationMailPayload = (userData, payload) => {
    log.info('Execution for building payload for sending mail started');

    const mailPayload = {
        emailId: userData.emailId,
        emailType: 'ACCOUNT_REGISTRATION_MAIL',
        context: {
            fullName: userData.firstName + ' ' + userData.lastName,
            accountName: payload.data.accountData.accountName,
            accountNumber: payload.data.accountData.accountNumber,
            holderName: payload.data.accountData.holderName,
            accountDate: payload.data.accountData.accountDate
        }
    };

    log.info('Execution for building mail payload completed');
    return mailPayload;
}

export {
    checkAccountByAccNumber,
    registerAccount,
    createTask,
    sendAccountCreationMailPayload
};
