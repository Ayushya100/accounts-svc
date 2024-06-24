'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-finance-service';
import { translate } from '../../utils/index.js';

const header = 'controller: register-user-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const checkUserByUserNameOrEmail = async(payload) => {
    registerLog.createDebugLog('Start checking if user is available');

    try {
        log.info('Execution for checking user with provided userName or emailId started');
        const response = {
            resType: 'SUCCESS',
            resMsg: translate('userRoutes', 'VALIDATION SUCCESSFULL'),
            isValid: true
        };

        log.info('Call db query to check for existing user record with user name or email id');
        const userFound = await dbConnect.isUserByUsernameOrEmailAvailable(payload.userName, payload.emailId);

        if (userFound) {
            log.error('User already exist with same username or emailId');
            response.resType = 'CONFLICT';
            response.resMsg = translate('userRoutes', 'User already exist with same username or emailId'),
            response.isValid = false;
        }

        log.info('Execution for checking existing record completed');
        return response;
    } catch (err) {
        log.error('Error while working with db to check for existing user with provided userName or emailId');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('userRoutes', 'Some error occurred while working with db to check for existing user with provided userName or emailId'),
            stack: err.stack,
            isValid: false
        };
    }
}

const createNewUser = async(payload) => {
    registerLog.createDebugLog('Start registering new user in system');

    try {
        log.info('Execution for registering new user started');
        log.info('Call db query to register new user');
        const newUser = await dbConnect.createNewUser(payload);

        log.info('Call db query to get all settings info');
        let settingsInfoToAdd = await dbConnect.getUserAssignableSettings();
        settingsInfoToAdd = settingsInfoToAdd.map((setting) => ({
            userId: newUser._id,
            settingId: setting._id,
            type: setting.type || 'boolean',
            value: setting.type === 'boolean' ? true : setting.default
        }));

        log.info('Call db query to register default dashboard settings to newly created user');
        await dbConnect.createUserSettings(settingsInfoToAdd);

        log.info('Call db query to get default user role');
        const roleIdToAdd = await dbConnect.isDefaultUserRoleAvailable();

        log.info('Call db query to assign default user role to newly created user');
        await dbConnect.assignUserRole(newUser._id, roleIdToAdd._id);

        if (newUser) {
            newUser.fullName = newUser.firstName + ' ' + newUser.lastName;

            log.info('Execution for registering new user completed');
            return {
                resType: 'REQUEST_COMPLETED',
                resMsg: translate('userRoutes', 'User Created Successfully'),
                data: newUser,
                isValid: true
            };
        }

        log.error('Error while calling the db query to register new user');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('userRoutes', 'User creation failed - some error occurred'),
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to register new user');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('userRoutes', 'Some error occurred while working with db to register new user'),
            stack: err.stack,
            isValid: false
        };
    }
}

const sendVerificationMailPayload = (userData) => {
    log.info('Execution for building payload for sending mail started');

    const mailPayload = {
        emailId: userData.emailId,
        emailType: 'USER_VERIFICATION_MAIL',
        context: {
            fullName: userData.firstName + ' ' + userData.lastName,
            verificationCode: process.env.FRONTEND_URL + '/verify-user/' + userData._id + '/' + userData.verificationCode
        }
    };

    log.info('Execution for building mail payload completed');
    return mailPayload;
}

export {
    checkUserByUserNameOrEmail,
    createNewUser,
    sendVerificationMailPayload
};
