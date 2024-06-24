'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-finance-service';
import { translate } from '../../utils/index.js';

const header = 'controller: update-user-password-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const updateUserPassword = async(userId, payload) => {
    registerLog.createDebugLog('Start operation to update user password');

    try {
        log.info('Execution for updating user password controller started');

        if (payload.oldPassword !== payload.newPassword) {
            log.info('Call db query to update user password');
            const isPasswordUpdated = await dbConnect.updateUserPassword(userId, payload);
            if (isPasswordUpdated) {
                log.info('Execution for updating user password completed');
                return {
                    resType: 'REQUEST_ACCEPTED',
                    resMsg: translate('userRoutes', 'User password updated successfully'),
                    data: isPasswordUpdated,
                    isValid: true
                };
            }

            log.error('BAD_REQUEST - Password does not match')
            return {
                resType: 'BAD_REQUEST',
                resMsg: translate('userRoutes', 'User Password not match'),
                isValid: false
            };
        }

        log.error('New password and old password are same');
        return {
            resType: 'BAD_REQUEST',
            resMsg: translate('userRoutes', 'New password cannot be same as old password'),
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with update user password controller');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('userRoutes', 'Some error occurred while working with db to update the user password'),
            stack: err.stack,
            isValid: false
        };
    }
}

const sendUpdatePasswordMailPayload = (userData) => {
    log.info('Execution for building payload for sending mail started');

    const mailPayload = {
        emailId: userData.emailId,
        emailType: 'USER_PASSWORD_UPDATED_MAIL',
        context: {
            fullName: userData.firstName + ' ' + userData.lastName
        }
    };

    log.info('Execuiton for building mail payload completed');
    return mailPayload;
}

export {
    updateUserPassword,
    sendUpdatePasswordMailPayload
};
