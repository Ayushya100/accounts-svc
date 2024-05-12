'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-finance-service';

const header = 'controller: get-user-setup-controller';

const log = logger(header);

const getSystemUserDashboardSetup = async() => {
    try {
        log.info('Execution for retrieving settings info for SYSTEM user controller started');
        log.info('Call db query to get the details of settings for SYSTEM user');

        const fieldsToRetrieve = [
            'application-title', 'application-quote', 'user-theme', 'user-language'
        ];
        const dashboardSettingDetails = await dbConnect.getSystemUserSettingInfo(fieldsToRetrieve);

        if (dashboardSettingDetails.length > 0) {
            log.info('Execution for retrieving setting info for SYSTEM user completed successfully');
            return {
                resType: 'SUCCESS',
                resMsg: 'Dashboard setting details found',
                data: dashboardSettingDetails,
                isValid: true
            };
        }

        log.error('No setting info found for SYSTEM user');
        return {
            resType: 'NOT_FOUND',
            resMsg: 'No Dashboard Setting Found',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to get all setting records for SYSTEM user');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    getSystemUserDashboardSetup
};
