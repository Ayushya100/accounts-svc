'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-finance-service';
import controller from '../../controllers/index.js';
import { COOKIE_OPTIONS } from '../../constants.js';

const header = 'route: refresh-token';
const msg = 'Refresh user token router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userController = controller.userController;

// API Function
const refreshAccessToken = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

        log.info('Call controller function to check the validity of token');
        const isTokenActive = userController.isTokenAvailableAndActive(refreshToken);
        if (!isTokenActive.isValid) {
            throw isTokenActive;
        }

        log.info('Call controller function to refresh the user tokens');
        const refreshedTokens = await userController.refreshTokens(isTokenActive.data._id);
        if (!refreshedTokens.isValid) {
            throw refreshedTokens;
        }

        log.success(`User tokens refreshed successfully`);
        res.status(responseCodes[refreshedTokens.resType])
        .cookie('accessToken', refreshedTokens.data.accessToken, COOKIE_OPTIONS)
        .cookie('refreshToken', refreshedTokens.data.refreshToken, COOKIE_OPTIONS)
        .json(
            buildApiResponse(refreshedTokens)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with refresh token router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default refreshAccessToken;
