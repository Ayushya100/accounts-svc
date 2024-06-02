'use strict';

import { buildApiResponse, responseCodes, logger } from 'lib-finance-service';
import controllers from '../../controllers/index.js';

const header = 'route: update-user-dashboard-setup';
const msg = 'Update user dashboard setup router started';

const log = logger(header);
const userController = controllers.userController;
const userDashboardController = controllers.userDashboardController;

// API Function
const updateUserDashboardSetup = async(req, res, next) => {
    log.info(msg);

    try {
        const userId = req.params.userId;
        const settingId = req.params.settingId;
        const payload = req.body;

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

        let updatedSetupDetails;
        if (!settingId) {
            log.info('Call controller function to update user dashboard setup info for user');
            updatedSetupDetails = await userDashboardController.updateAllUserDashboardSetup(userId, payload, userDashboardSettings.data);
        } else {
            log.info('Call controller function to update user dashboard setting info for requested setting info by id');
            updatedSetupDetails = await userDashboardController.updateUserDashboardSetupById(userId, settingId, payload, userDashboardSettings.data);
        }
        if (!updatedSetupDetails.isValid) {
            throw updatedSetupDetails;
        }

        log.success('Successfully updated requested user setup records in db');
        res.status(responseCodes[updatedSetupDetails.resType]).json(
            buildApiResponse(updatedSetupDetails)
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

export default updateUserDashboardSetup;
