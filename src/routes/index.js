'use strict';

import healthCheck from './healthCheck.route.js';
import users from './user-routes/index.js';
import settingRoutes from './system-setting-routes/index.js';
import serviceRoutes from './service-setting-routes/index.js';
import dashboardRoutes from './dashboard-routes/index.js';

export default {
  healthCheck,
  users,
  settingRoutes,
  serviceRoutes,
  dashboardRoutes,
};
