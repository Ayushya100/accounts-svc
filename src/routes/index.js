'use strict';

import healthCheck from './healthCheck.route.js';
import settingRoutes from './system-setup-routes/index.js';
import accountRoutes from './account-routes/index.js';

export default {
  healthCheck,
  settingRoutes,
  accountRoutes,
};
