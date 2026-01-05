'use strict';

import { verifyUserRoleExist, registerNewUserRole } from './registerUserRole.controller.js';
import { getUserRoleById, getAllUserRoles } from './getUserRole.controller.js';
import { verifyUserScopeExist, registerNewUserScope } from './registerUserScope.controller.js';
import { getUserScopeById } from './getUserScope.controller.js';

export default {
  verifyUserRoleExist,
  registerNewUserRole,
  getUserRoleById,
  getAllUserRoles,
  verifyUserScopeExist,
  registerNewUserScope,
  getUserScopeById,
};
