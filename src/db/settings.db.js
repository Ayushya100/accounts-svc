'use strict';

import mongoose from 'mongoose';

// Import DB Models
import { 
    DashboardSettingsModel,
    executeQuery
} from 'lib-finance-service';

const isSettingByNameAvailable = async(body) =>{
    const settingDetails = DashboardSettingsModel.findOne(body);
    return await executeQuery(settingDetails);
}

const registerNewSetting = async(payload) => {
    return await DashboardSettingsModel.create(payload);
}

export {
    isSettingByNameAvailable,
    registerNewSetting
};
