'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-finance-service';
import controllers from '../../controllers/index.js';

const header = 'route: update-setting';
const msg = 'Update Setting Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const dashboardController = controllers.dashboardController;
const userController = controllers.userController;

// API Function
const updateSetting = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);
    
    try {
        const settingId = req.params.id;
        const payload = req.body;
        const userId = req.user.userId;

        log.info(`Call controller function to check if user exists for provided id : ${userId}`);
        const userExists = await userController.checkUserById(userId);
        if (!userExists.isValid) {
            throw userExists;
        }

        let dashboardSettings;
        if (!settingId) {
            log.info('Call controller function get the details of all system dashboard setup');
            dashboardSettings = await dashboardController.getAllSettings();
        } else {
            log.info(`Call controller funciton to get dashboard setup info for requested setup id : ${settingId}`);
            dashboardSettings = await dashboardController.getSettingInfoById(settingId);
        }
        if (!dashboardSettings.isValid) {
            throw dashboardSettings;
        }

        let updateDashboardSetting;
        if (!settingId) {
            log.info(`Call controller function to upddate system dashboard setup info`);
            updateDashboardSetting = await dashboardController.updateAllSettings(userId, payload, dashboardSettings.data);
        } else {
            log.info(`Call controller function to update dashboard setting info for requested setting id : ${settingId}`);
            updateDashboardSetting = await dashboardController.updateSettingInfoById(userId, settingId, payload, dashboardSettings.data);
        }
        if (!updateDashboardSetting.isValid) {
            throw updateDashboardSetting;
        }

        log.success(`Successfully updated dashboard setting record for id (${settingId}) in db`);
        res.status(responseCodes[updateDashboardSetting.resType]).json(
            buildApiResponse(updateDashboardSetting)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with update setting info router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default updateSetting;
