'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-finance-service';

const header = 'controller: update-setting';

const log = logger(header);
const registerLog = createNewLog(header);

const updateAllSettings = async(userId, payload, settingData) => {
    registerLog.createDebugLog('Update requested setting info');

    try {
        log.info('Execution for updating all dashboard setting records started');
        
        let dashboardSettingRecords = [];
        for (let record of payload.records) {
            console.log(record);
            let settingRecord = settingData.filter(setting => String(setting._id) === record._id);
            if (settingRecord.length === 0) {
                return {
                    resType: 'NOT_FOUND',
                    resMsg: `Provided dashboard setting id (${record._id}) is incorrect, cannot proceed further.`,
                    isValid: false
                };
            }

            settingRecord = settingRecord[0];
            let data = {
                _id: record._id,
                categoryName: record.categoryName || settingRecord.categoryName,
                categoryDescription: record.categoryDescription || settingRecord.categoryDescription,
                categoryType: record.categoryType || settingRecord.categoryType,
                subCategory: record.subCategory || settingRecord.subCategory,
                type: record.type || settingRecord.type,
                isPeriodic: record.isPeriodic || settingRecord.isPeriodic,
                duration: record.duration || settingRecord.duration,
                default: record.default || settingRecord.default
            };
            dashboardSettingRecords.push(data);
        }

        log.info('Call db query to update the details of all dashboard setup for system user');
        const updatedDashboardSettings = await dbConnect.updateSystemDashboardSetting(userId, dashboardSettingRecords, true);
        if (updatedDashboardSettings) {
            log.info('Execution for updating all dashboard setting records completed successfully');
            return {
                resType: 'REQUEST_COMPLETED',
                resMsg: 'Dashboard settings updated successfully',
                data: updatedDashboardSettings,
                isValid: true
            };
        }

        log.error('Some error occurred while updating system dashboard setting records');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while updating system dashboard setting records',
            isValid: false
        };
    } catch (err) {
        log.error(`Error while working with db to update all dashboard settings info.`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to update all dashboard settings info',
            stack: err.stack,
            isValid: false
        };
    }
}

const updateSettingInfoById = async(userId, settingId, payload, settingRecord) => {
    registerLog.createDebugLog('Update requested setting info');

    try {
        log.info('Execution for updating dashboard setup reocrd for requested setting id controller started');

        let isValidToProceed = true;
        if (payload.default && payload.type && typeof payload.default !== payload.type) {
            isValidToProceed = false;
        } else if (payload.default && typeof payload.default !== settingRecord.type) {
            isValidToProceed = false;
        }

        if (!isValidToProceed) {
            return {
                resType: 'BAD_REQUEST',
                resMsg: `Provided value for requested setting '${settingId}' does not match with its type - Cannot proceed with update`,
                isValid: false
            };
        }

        let dashboardSettingRecords = {
            _id: settingId,
            categoryName: payload.categoryName || settingRecord.categoryName,
            categoryDescription: payload.categoryDescription || settingRecord.categoryDescription,
            categoryType: payload.categoryType || settingRecord.categoryType,
            subCategory: payload.subCategory || settingRecord.subCategory,
            type: payload.type || settingRecord.type,
            isPeriodic: payload.isPeriodic || settingRecord.isPeriodic,
            duration: payload.duration || settingRecord.duration,
            default: payload.default || settingRecord.default
        };

        log.info(`Call db query to update the detail of requested dashboard setting for provided id ${settingId}`);
        const updatedDashboardSettings = await dbConnect.updateSystemDashboardSetting(userId, dashboardSettingRecords, false);
       
        if (updatedDashboardSettings) {
            log.info('Execution for updating Dashboard setting record completed successfully');
            return {
                resType: 'REQUEST_COMPLETED',
                resMsg: 'Dashboard Setting Details Updated successfully',
                data: updatedDashboardSettings,
                isValid: true
            };
        }
        
        log.error(`Error occurred while updating dashboard setting record for requested setting id : ${settingId}`);
        return {
            resType: 'NOT_FOUND',
            resMsg: 'No Dashboard Setting Found',
            isValid: false
        };
    } catch (err) {
        log.error(`Error while working with db to update dashboard setting info for requested id : ${settingId}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to dashboard update setting info',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    updateAllSettings,
    updateSettingInfoById
};
