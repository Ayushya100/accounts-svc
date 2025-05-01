'use strict';

import registerUserRole from './registerUserRole.route.js';
import getAllUserRoles from './getAllUserRoles.route.js';
import getUserRoleById from './getUserRoleById.route.js';
import updateUserRole from './updateUserRole.route.js';
import deleteUserRole from './deleteUserRole.route.js';
import registerUserScope from './registerUserScope.route.js';
import getAllUserScopes from './getAllUserScope.route.js';

export default {
  registerUserRole,
  getAllUserRoles,
  getUserRoleById,
  updateUserRole,
  deleteUserRole,
  registerUserScope,
  getAllUserScopes
};
