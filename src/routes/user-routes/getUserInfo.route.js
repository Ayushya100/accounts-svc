'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-finance-service';
import controller from '../../controllers/index.js';

const header = 'route: get-user-info';
const msg = 'Get User Info Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userController = controller.userController;

// API Function
const getUserInfo = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;

        log.info('Call controller function to get user records');
        const getUserInfo = await userController.getUserDtlInfo(userId);
        if (!getUserInfo.isValid) {
            throw getUserInfo;
        }

        registerLog.createInfoLog('User info returned successfully', null, getUserInfo);
        log.success(`Successfully retrieved required user info from db`);
        res.status(responseCodes[getUserInfo.resType]).json(
            buildApiResponse(getUserInfo)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with get user info router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default getUserInfo;
