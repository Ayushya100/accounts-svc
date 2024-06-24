'use strict';

import jwt from 'jsonwebtoken';
import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-finance-service';
import { translate } from '../../utils/index.js';

const header = 'controller: refresh-token-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const isTokenAvailableAndActive = (refreshToken) => {
    registerLog.createDebugLog('Start checking the validity of token');

    try {
        log.info('Execution for checking the validity of token has started');
        if (!refreshToken) {
            log.error('Token not found');
            return next({
                resType: 'BAD_REQUEST',
                resMsg: translate('userRoutes', 'Token not found'),
                isValid: false
            });
        }

        const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
        
        log.info('Token verification completed successfully');
        return {
            resType: 'SUCCESS',
            resMsg: translate('userRoutes', 'Token Verified successfully'),
            data: decodedRefreshToken,
            isValid: true
        };
    } catch(err) {
        log.error('Unauthorized access token got expired or not found');
        return {
            resType: 'UNAUTHORIZED',
            resMsg: translate('userRoutes', 'UNAUTHORIZED ACCESS - TOKEN EXPIRED / NOT FOUND'),
            stack: err.stack,
            isValid: false
        };
    }
}

const refreshTokens = async(userId) => {
    registerLog.createDebugLog('Generate new tokens for user');

    try {
        log.info('Execution for generating new access and refresh token has been initiated');
        const refreshedTokens = await dbConnect.refreshTokens(userId);

        log.info('Execution for generating new tokens completed');
        return {
            resType: 'REQUEST_ACCEPTED',
            resMsg: translate('userRoutes', 'Tokens has been refreshed successfully'),
            data: refreshedTokens,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to generate access and refresh tokens');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('userRoutes', 'Some error occurred while working with db to refresh user tokens'),
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    isTokenAvailableAndActive,
    refreshTokens
};
