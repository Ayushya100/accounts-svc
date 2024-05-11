'use strict';

import { validateCreateSettingPayload } from './validatePayload.controller.js';
import { isSettingAvailable, createSetting } from './registerSetting.controller.js';
import { getAllSettings, getSettingInfoById } from './getSettingInfo.controller.js';

export default {
    validateCreateSettingPayload,
    isSettingAvailable,
    createSetting,
    getAllSettings,
    getSettingInfoById
};
