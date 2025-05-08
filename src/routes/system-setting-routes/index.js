'use strict';

import registerUserRole from './registerUserRole.route.js';
import getUserRoles from './getUserRoles.route.js';
import updateUserRole from './updateUserRole.route.js';
import deleteUserRole from './deleteUserRole.route.js';
import registerUserScope from './registerUserScope.route.js';
import getUserScopes from './getUserScopes.route.js';
import updateUserScope from './updateUserScope.route.js';
import deleteUserScope from './deleteUserScope.route.js';
import getUnassignedScopes from './getUnassignedScopes.route.js';
import getAssignedScopes from './getAssignedScopes.route.js';
import assignScopesToRole from './assignScopeToRole.route.js';

export default {
  registerUserRole,
  getUserRoles,
  updateUserRole,
  deleteUserRole,
  registerUserScope,
  getUserScopes,
  updateUserScope,
  deleteUserScope,
  getUnassignedScopes,
  getAssignedScopes,
  assignScopesToRole,
};
