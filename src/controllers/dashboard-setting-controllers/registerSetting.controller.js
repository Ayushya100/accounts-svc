'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-finance-service';

const header = 'controller: register-setting';

const log = logger(header);

const isSettingAvailable = async(payload) => {
    try {
        log.info('Execution to check for existing setting controller started');
        let response = {
            resType: 'SUCCESS',
            resMsg: 'VALIDATION SUCCESSFULL',
            isValid: true
        };

        log.info('Call db query to check for the existing records');
        const settingDetails = await dbConnect.isSettingAvailable(payload);

        if (settingDetails) {
            log.error(`Conflict, record already exists for requested category with name : ${payload.categoryName}`);
            response.resType = 'CONFLICT';
            response.resMsg = 'Setting already exists with same name.';
            response.isValid = false;
        }

        log.info('Execution for checking existing record completed');
        return response;
    } catch (err) {
        log.error(`Error while working with db to check for existing setting record : ${err}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const createSetting = async(payload) => {
    try {
        log.info('Execution for registering new setting controller started');
        payload.type = payload.type || 'Boolean';

        const newSettingPayload = {
            categoryName: payload.categoryName,
            categoryDescription: payload.categoryDescription,
            categoryType: payload.categoryType,
            subCategory: payload.subCategory,
            type: payload.type,
            isPeriodic: payload.isPeriodic,
            duration: payload.duration,
            default: payload.defaultValue,
            isUserAssignable: payload.isUserAssignable
        };

        log.info('Call db query to register new records');
        const newSetting = await dbConnect.registerNewSetting(newSettingPayload);

        log.success('Execution for new record completed');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'Setting Created Successfully',
            data: newSetting,
            isValid: true
        };
    } catch (err) {
        log.error(`Error while working with db to register new setting record : ${err}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    isSettingAvailable,
    createSetting
};
