'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-finance-service';

const header = 'controller: deactivate-user';

const log = logger(header);
const registerLog = createNewLog(header);

const validateUserCredentials = async(userId, payload) => {
    registerLog.createDebugLog('Start operation to validate user credentials');

    try {
        log.info('Execution for validating user credentials started');
        log.info('Call db query to get user info');
        const userInfo = await dbConnect.getUserFullDetails(userId);

        if (!userInfo.isDeleted) {
            log.info('Call db query to validate user password');
            if ((userInfo.userName == payload.userName) && (await dbConnect.verifyPassword(userInfo, payload.password))) {
                log.info('User credential validation successfull');
                return {
                    resType: 'SUCCESS',
                    resMsg: 'VALIDATION SUCCESSFULL',
                    isValid: true
                };
            }

            log.error('Unauthorized access - credentials invalid');
            return {
                resType: 'UNAUTHORIZED',
                resMsg: 'Credentials invalid',
                isValid: false
            };
        }
        
        log.error('User is already deactivated - cannot process the new request to deactivate');
        return {
            resType: 'BAD_REQUEST',
            resMsg: 'User Already Deactive',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to validate user.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to validate user credentials',
            stack: err.stack,
            isValid: false
        };
    }
}

const deactivateUser = async(userId) => {
    registerLog.createDebugLog('Start operation to deactivate user');

    try {
        log.info('Execution for deactivating user started');
        log.info('Call db query to deactivate user');
        const isUserDeactivated = await dbConnect.userDeactivate(userId);

        if (isUserDeactivated) {
            log.info('User deactivated successfully');
            return {
                resType: 'REQUEST_COMPLETED',
                resMsg: 'User deactivated successfully',
                data: isUserDeactivated,
                isValid: true
            };
        }
        
        log.error('Failed to deactivate the user');
        return {
            resType: 'BAD_REQUEST',
            resMsg: 'Operation failed to deactivate the user',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to deactivate user controller function');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: err,
            stack: err.stack,
            isValid: false
        };
    }
}

const sendAccountDeactivateMailPayload = (userData) => {
    log.info('Execution for building payload for sending mail started');
    const modifiedOn = userData.modifiedOn;

    const mailPayload = {
        emailId: userData.emailId,
        emailType: 'USER_DEACTIVATE_MAIL',
        context: {
            fullName: userData.firstName + ' ' + userData.lastName,
            dateOfDeactivation: modifiedOn.toDateString(),
            reactivationTimeline: new Date(modifiedOn.setDate(modifiedOn.getDate() + 30)).toDateString()
        }
    };

    log.info('Execution for building mail payload completed');
    return mailPayload;
}

export {
    validateUserCredentials,
    deactivateUser,
    sendAccountDeactivateMailPayload
};
