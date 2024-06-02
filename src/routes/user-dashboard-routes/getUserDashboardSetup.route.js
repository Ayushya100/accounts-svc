'use strict';

import { buildApiResponse, responseCodes, logger } from 'lib-finance-service';
import controllers from '../../controllers/index.js';

const header = 'route: get-user-dashboard-setup';
const msg = 'Get user dashboard setup router started';

const log = logger(header);
const userController = controllers.userController;
const userDashboardController = controllers.userDashboardController;

// API Function
const getUserDashboardSetup = async(req, res, next) => {
    log.info(msg);

    try {
        const userId = req.params.userId;
        const settingId = req.params.settingId;

        log.info(`Call controller function to check if user exists for provided id : ${userId}`);
        const userExists = await userController.checkUserById(userId);
        if (!userExists.isValid) {
            throw userExists;
        }

        let userDashboardSettings;
        if (!settingId) {
            log.info('Call controller function to get all user setup info for user');
            userDashboardSettings = await userDashboardController.getAllUserDashboardSetting(userId);
        } else {
            log.info('Call controller function to get user setup info for requested setting info by id');
            userDashboardSettings = await userDashboardController.getUserDashboardSettingById(userId, settingId);
        }
        if (!userDashboardSettings.isValid) {
            throw userDashboardSettings;
        }

        log.success('Successfully retrieved requested user setup records from db');
        res.status(responseCodes[userDashboardSettings.resType]).json(
            buildApiResponse(userDashboardSettings)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with get user setup for user');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default getUserDashboardSetup;
