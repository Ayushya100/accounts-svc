'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-finance-service';

const header = 'controller: get-setting-info';

const log = logger(header);

const getAllSettings = async() => {
    try {
        log.info('Execution for retrieving all settings info controller started');
        log.info('Call db query to get the details of all setting records');
        const settingDetails = await dbConnect.getAllSettings();

        if (settingDetails.length === 0) {
            log.info('No setting info available');
            return {
                resType: 'CONTENT_NOT_AVAILABLE',
                resMsg: 'No Dashboard setting record found',
                data: [],
                isValid: true
            };
        }

        log.info('Execution for retrieving all settings info completed successfully');
        return {
            resType: 'SUCCESS',
            resMsg: 'All settings found',
            data: settingDetails,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to get all setting records');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to retrieve setting records',
            stack: err.stack,
            isValid: false
        };
    }
}

const getSettingInfoById = async(settingId) => {
    try {
        log.info(`Execution for retrieving setting info for provided id (${settingId}) controller started`);
        log.info('Call db query to get the details of setting for requested id');
        const settingDetail = await dbConnect.getSettingInfoById(settingId);

        if (!settingDetail || settingDetail.length === 0) {
            log.error('No information found for requested setting id');
            return {
                resType: 'NOT_FOUND',
                resMsg: 'Setting info not found',
                isValid: false
            };
        }

        log.success(`Execution for retrieving setting info for provided id (${settingId}) completed successfully`);
        return {
            resType: 'SUCCESS',
            resMsg: 'Setting info retrieved successfully',
            data: settingDetail,
            isValid: true
        };
    } catch (err) {
        log.error(`Error while working with db to get setting info for requested id : ${settingId}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    getAllSettings,
    getSettingInfoById
}