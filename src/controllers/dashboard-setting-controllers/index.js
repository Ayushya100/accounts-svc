'use strict';

import { validateCreateSettingPayload, validateNewRoutePayload } from './validatePayload.controller.js';
import { isSettingAvailable, createSetting } from './registerSetting.controller.js';
import { getAllSettings, getSettingInfoById } from './getSettingInfo.controller.js';
import { isRouteAvailable, createRoute } from './registerRoute.controller.js';

export default {
    validateCreateSettingPayload,
    validateNewRoutePayload,
    isSettingAvailable,
    createSetting,
    getAllSettings,
    getSettingInfoById,
    isRouteAvailable,
    createRoute
};
