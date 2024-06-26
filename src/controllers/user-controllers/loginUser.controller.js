'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-finance-service';
import { translate } from '../../utils/index.js';

const header = 'controller: login-user-controller';

const log = logger(header);
const registerLog = createNewLog(header);

// Check if user is authorized
const isUserValid = async(payload) => {
    registerLog.createDebugLog('Start checking if user is authorized');

    try {
        log.info('Execution for checking if user is authorized, has been started');

        const userNameOrEmail = payload.userNameOrEmail;
        log.info('Call db query to get the user based on userName or emailId');
        const isUserAvailable = await dbConnect.isUserByUsernameOrEmailAvailable(userNameOrEmail, userNameOrEmail);

        if (isUserAvailable) {
            log.info('Call db query to verify user password');
            const isPasswordValid = await dbConnect.verifyPassword(isUserAvailable, payload.password);

            if (isPasswordValid) {
                log.info('Execution for checking user authorization completed successfully');
                return {
                    resType: 'SUCCESS',
                    resMsg: translate('userRoutes', 'VALIDATION SUCCESSFULL'),
                    data: isUserAvailable,
                    isValid: true
                };
            }

            log.error('Unauthorized user - credentials invalid');
            return {
                resType: 'UNAUTHORIZED',
                resMsg: translate('userRoutes', 'Unauthorized user - credentials invalid'),
                isValid: false
            };
        }

        log.error('User not found');
        return {
            resType: 'NOT_FOUND',
            resMsg: translate('userRoutes', 'User not found'),
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to check if user is authorized');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('userRoutes', 'Some error occurred while working with db to check if user is authorized'),
            stack: err.stack,
            isValid: false
        };
    }
}

// Check if user verified
const isUserVerified = async(user) => {
    registerLog.createDebugLog('Start checking if user is authorized');

    try {
        log.info('Execution for checking if user is verified or not, has started');
    
        if (user.isVerified) {
            log.info('Execution for checking user verification completed');
            return {
                resType: 'SUCCESS',
                resMsg: translate('userRoutes', 'User verified'),
                isValid: true
            };
        }
    
        log.info('Call db query to generate user verification code');
        const updatedUserInfo = await dbConnect.generateVerificationCode(user._id);
    
        log.error('The user is not verified yet');
        return {
            resType: 'BAD_REQUEST',
            resMsg: translate('userRoutes', 'User not yet verified'),
            data: updatedUserInfo,
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to generate new verification code');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('userRoutes', 'Some error occurred while working with db to generate new verification code'),
            stack: err.stack,
            isValid: false
        };
    }
}

// Reactivate User
const isUserActive = async(user) => {
    registerLog.createDebugLog('Start checking if user is authorized');
    log.info('Execution for checking if user is active, has started');

    if (user.isDeleted) {
        log.info('Call db query to reactivate user');
        await dbConnect.reactivateUser(user._id);

        log.info('User reactivated successfully');
        return true;
    }
    log.info('Execution completed');
    return false;
}

// Login and generate tokens
const generateAccessAndRefreshTokens = async(userId) => {
    registerLog.createDebugLog('Generate tokens for user');

    try {
        log.info ('Execution for generating access and refresh token has been initialized');
        const loggedInUser = await dbConnect.generateAccessAndRefreshTokens(userId);

        log.info('Execution for generating tokens completed');
        return {
            resType: 'SUCCESS',
            resMsg: translate('userRoutes', 'Login successfull'),
            data: loggedInUser,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to generate access and refresh tokens');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('userRoutes', 'Some error occurred while working with db to generate access and refresh tokens'),
            stack: err.stack,
            isValid: false
        };
    }
}

const sendAccountReactivationMailPayload = (userData) => {
    log.info('Execution for building payload for sending mail started');

    const mailPayload = {
        emailId: userData.emailId,
        emailType: 'USER_REACTIVATE_MAIL',
        context: {
            fullName: userData.firstName + ' ' + userData.lastName
        }
    };

    log.info('Execution for creating mail payload completed');
    return mailPayload;
}

export {
    isUserValid,
    isUserVerified,
    isUserActive,
    generateAccessAndRefreshTokens,
    sendAccountReactivationMailPayload
};
