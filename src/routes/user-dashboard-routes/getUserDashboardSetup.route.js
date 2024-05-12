'use strict';

import { buildApiResponse, responseCodes, logger } from 'lib-finance-service';
import controllers from '../../controllers/index.js';

const header = 'route: get-user-dashboard-setup';
const msg = 'Get user dashboard setup router started';

const log = logger(header);
const userDashboardController = controllers.userDashboardController;

// API Function
const getUserDashboardSetup = async(req, res, next) => {
    log.info(msg);

    try {
        const userId = req.params.userId;
        const userSettingId = req.params.userSettingId;

        let dashboardSettingDetails;
        if (userId === 'SYSTEM') {
            log.info('Call controller function to get settings info for SYSTEM user');
            dashboardSettingDetails = await userDashboardController.getSystemUserDashboardSetup();
        }

        if (!dashboardSettingDetails.isValid) {
            throw dashboardSettingDetails;
        }

        log.success('Successfully retrieved requested setting records from db');
        res.status(responseCodes[dashboardSettingDetails.resType]).json(
            buildApiResponse(dashboardSettingDetails)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with register setting router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default getUserDashboardSetup;
