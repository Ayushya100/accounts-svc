'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-finance-service';

const header = 'controller: get-user-setup-controller';

const log = logger(header);

const getAllUserDashboardSetting = async(userId) => {
    try {
        log.info('Execution for retrieving settings info for requested user id controller started');
        log.info('Call db query to get the details of settings for requested user id record');
        const userDashboardSettings = await dbConnect.getDashboardSettingByUserId(userId, null);

        if (userDashboardSettings.length > 0) {
            log.info('Execution for retrieving settings info for requested user completed successfully');
            return {
                resType: 'SUCCESS',
                resMsg: 'Dashboard setup details found',
                data: userDashboardSettings,
                isValid: true
            };
        }

        log.error(`No setting records found for provided user id : ${userId}`);
        return {
            resType: 'NOT_FOUND',
            resMsg: 'No user setup found',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to get all setting records for user');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to retrieve all settings records for requested user',
            stack: err.stack,
            isValid: false
        };
    }
}

const getUserDashboardSettingById = async(userId, settingId) => {
    try {
        log.info('Execution for retrieving setting info for requested setting by provided id controller started');
        log.info('Call db query to get the details of setting for provided setting id record');
        const userDashboardSetting = await dbConnect.getDashboardSettingByUserId(userId, settingId);

        if (userDashboardSetting.length > 0) {
            log.info('Execution for retrieving setting info for requested setting id completed successfully');
            return {
                resType: 'SUCCESS',
                resMsg: 'Dashboard setup details found',
                data: userDashboardSetting,
                isValid: true
            };
        }

        log.error('No setting record found for provided setting id');
        return {
            resType: 'NOT_FOUND',
            resMsg: 'No dashboard setup Found',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to get desired setting record for requested user');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to retrieve requested setting info for requested user',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    getAllUserDashboardSetting,
    getUserDashboardSettingById
};
