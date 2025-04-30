'use strict';

import healthCheck from './healthCheck.route.js';
import users from './user-routes/index.js';
import settingRoutes from './system-setting-routes/index.js';

export default {
  healthCheck,
  users,
  settingRoutes,
};
