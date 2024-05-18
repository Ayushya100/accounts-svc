'use strict';

import { buildApiResponse, responseCodes, logger } from 'lib-finance-service';
import controllers from '../../controllers/index.js';

const header = 'route: get-system-setup';
const msg = 'Get system setup router started';

const log = logger(header);
const userDashboardController = controllers.userDashboardController;

// API Function
const getSystemSetup = async(req, res, next) => {
    log.info(msg);

    try {
        log.info('Call controller function to get setup info for SYSTEM user');
        const setupInfo = await userDashboardController.getSystemSetup();
        if (!setupInfo.isValid) {
            throw setupInfo;
        }

        log.success('Successfully retrieved system setup records from db');
        res.status(responseCodes[setupInfo.resType]).json(
            buildApiResponse(setupInfo)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with retrieving system setup router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default getSystemSetup;
