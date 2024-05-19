'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-finance-service';

const header = 'controller: verify-user-controller';

const log = logger(header);
const registerLog = createNewLog(header);

// Verify user
const verifyUser = async(payload) => {
    registerLog.createDebugLog('Start verifying the user');

    try {
        log.info('Execution for verifying user started');
        let currentTime = new Date(Date.now());

        log.info('Call db query to get the existing record');
        const userInfo = await dbConnect.getUserFullDetails(payload.userId);

        log.info('Check if verification code is valid');
        if (userInfo && (userInfo.verificationCode === payload.verificationCode) && (currentTime <= userInfo.verificationCodeExpiry)) {
            log.info('Call db query to complete user verification');
            const verifiedUser = await dbConnect.validateUser(payload.userId);

            log.info('Execution for verifying user completed successfully');
            return {
                resType: 'REQUEST_COMPLETED',
                resMsg: 'User Verification successful',
                data: verifiedUser,
                isValid: true
            };
        }

        log.error('Bad request, user verification failed');
        return {
            resType: 'BAD_REQUEST',
            resMsg: 'User Verification failed!',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to verify the user');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to verify the user',
            stack: err.stack,
            isValid: false
        };
    }
}

const sendVerificationSuccessfulMailPayload = (userData) => {
    log.info('Execution for building payload for sending mail started');

    const mailPayload = {
        emailId: userData.emailId,
        emailType: 'VERIFICATION_SUCCESSFULL_MAIL',
        context: {
            fullName: userData.firstName + ' ' + userData.lastName,
            firstName: userData.firstName,
            lastName: userData.lastName,
            userName: userData.userName,
            contactNumber: userData.contactNumber,
            emailId: userData.emailId
        }
    };

    log.info('Execution for building mail payload completed');
    return mailPayload;
}

export {
    verifyUser,
    sendVerificationSuccessfulMailPayload
};
