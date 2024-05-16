'use strict';

import { buildApiResponse, responseCodes, logger } from 'lib-finance-service';
import controllers from '../../controllers/index.js';

const header = 'route: get-setting-info';
const msg = 'Get setting info router started';

const log = logger(header);
const dashboardController = controllers.dashboardController;

// API Function
const getSettingInfo = async(req, res, next) => {
    log.info(msg);

    try {
        const label = req.params.label;

        let settingInfo;
        if (!label) {
            log.info('Call controller function to retrieve all settings info');
            settingInfo = await dashboardController.getAllSettings();
        } else {
            log.info(`Call controller function to retrieve the setting info for requested id or category name : ${label}`);
            settingInfo = await dashboardController.getSettingInfoById(label);
        }

        if (!settingInfo.isValid) {
            throw settingInfo;
        }

        log.success('Successfully retrieved requested setting records from db');
        res.status(responseCodes[settingInfo.resType]).json(
            buildApiResponse(settingInfo)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with get setting info router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default getSettingInfo;
