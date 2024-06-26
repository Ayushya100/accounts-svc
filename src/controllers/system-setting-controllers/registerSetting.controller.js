'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-finance-service';
import { translate } from '../../utils/index.js';

const header = 'controller: register-setting';
const log = logger(header);

const isSettingAvailable = async(payload) => {
    try {
        log.info('Execution to check for existing setting controller started');
        let response = {
            resType: 'SUCCESS',
            resMsg: translate('settingRoutes', 'VALIDATION SUCCESSFULL'),
            isValid: true
        };

        log.info('Call db query to check for the existing setting records');
        const settingDetails = await dbConnect.isSettingAvailable(payload);

        if (settingDetails) {
            log.error(`Conflict, record already exists for requested category with name : ${payload.categoryName}`);
            response.resType = 'CONFLICT';
            response.resMsg = translate('settingRoutes', 'Setting already exists with same category name');
            response.isValid = false;
        }

        log.info('Execution for checking existing setting record completed');
        return response;
    } catch (err) {
        log.error(`Error while working with db to check for existing setting record : ${err}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('settingRoutes', 'Some error occurred while working with db to check for existing setting record'),
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
            type: payload.type.toLowerCase(),
            isPeriodic: payload.isPeriodic,
            duration: payload.duration,
            default: payload.defaultValue,
            isUserAssignable: payload.isUserAssignable
        };

        log.info('Call db query to register new setting record');
        const newSetting = await dbConnect.registerNewSetting(newSettingPayload);

        log.success('Execution for new record completed');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: translate('settingRoutes', 'Setting Created Successfully'),
            data: newSetting,
            isValid: true
        };
    } catch (err) {
        log.error(`Error while working with db to register new setting record : ${err}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('settingRoutes', 'Some error occurred while working with db to register new setting'),
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    isSettingAvailable,
    createSetting
};
