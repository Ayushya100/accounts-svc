'use strict';

import registerUserRole from './registerUserRole.route.js';
import getUserRole from './getUserRole.route.js';
import registerUserScope from './registerUserScope.route.js';
import getUserScope from './getUserScope.route.js';
import updateUserRole from './updateUserRole.route.js';
import deleteUserRole from './deleteUserRole.route.js';
import updateUserScope from './updateUserScope.route.js';
import deleteUserScope from './deleteUserScope.route.js';
import getScopeList from './getScopeList.route.js';
import assignScopes from './assignScopes.route.js';

export default {
  registerUserRole,
  getUserRole,
  registerUserScope,
  getUserScope,
  updateUserRole,
  deleteUserRole,
  updateUserScope,
  deleteUserScope,
  getScopeList,
  assignScopes,
};
