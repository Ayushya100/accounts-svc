'use strict';

import { buildApiResponse, responseCodes, logger } from 'lib-finance-service';
import controller from '../../controllers/index.js';

const header = 'route: register-setting';
const msg = 'Register new setting router started';

const log = logger(header);
const dashboardController = controller.dashboardController;

// API Function
const registerSetting = async(req, res, next) => {
    log.info(msg);

    try {
        const payload = req.body;

        log.info('Call controller function to validate payload');
        const isValidPayload = dashboardController.validateCreateSettingPayload(payload);
        if (!isValidPayload.isValid) {
            throw isValidPayload;
        }

        log.info('Call controller function to check for existing record of requested setting');
        const isSettingAvailable = await dashboardController.isSettingAvailable(payload);
        if (!isSettingAvailable.isValid) {
            throw isSettingAvailable;
        }

        log.info('Call controller function to register new setting started');
        const settingCreated = await dashboardController.createSetting(payload);
        if (!settingCreated.isValid) {
            throw settingCreated;
        }

        log.success(`Successfully registered new setting (${payload.categoryName}) in db`);
        res.status(responseCodes[settingCreated.resType]).json(
            buildApiResponse(settingCreated)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with register new setting router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default registerSetting;
