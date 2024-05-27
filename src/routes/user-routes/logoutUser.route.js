'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-finance-service';
import controller from '../../controllers/index.js';
import { COOKIE_OPTIONS } from '../../constants.js';

const header = 'route: logout-user';
const msg = 'Logout user router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userController = controller.userController;

// API Function
const logoutUser = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.user.userId;

        log.info(`Call controller function to check if user exists for provided id : ${userId}`);
        const userExists = await userController.checkUserById(userId);
        if (!userExists.isValid) {
            throw userExists;
        }

        log.info('Call controller function to logout user');
        const userUpdated = await userController.logoutUser(userId);
        if (!userUpdated.isValid) {
            throw userUpdated;
        }

        log.success(`User tokens refreshed successfully`);
        res.status(responseCodes[userUpdated.resType])
        .clearCookie('accessToken', COOKIE_OPTIONS)
        .clearCookie('refreshToken', COOKIE_OPTIONS)
        .json(
            buildApiResponse(userUpdated)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with user logout router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default logoutUser;
