'use strict';

import settingRoutes from './system-setting-routes/index.js';
import userSetting from './user-dashboard-routes/index.js';
import userRoutes from './user-routes/index.js';
import setupRoutes from './setup-routes/index.js';
import paymentRoutes from './payment-options-routes/index.js';

export default {
    settingRoutes,
    userSetting,
    userRoutes,
    setupRoutes,
    paymentRoutes
};
