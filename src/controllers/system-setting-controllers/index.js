'use strict';

import { verifyUserRoleExist, registerNewUserRole } from './registerUserRole.controller.js';
import { getRoleById, getAllUserRoles } from './getUserRole.controller.js';
import { updateUserRole } from './updateUserRole.controller.js';
import { deleteRole } from './deleteUserRole.controller.js';
import { verifyUserScopeExist, registerNewUserScope } from './registerUserScope.controller.js';
import { getScopeById, getAllUserScopes } from './getUserScope.controller.js';

export default {
  verifyUserRoleExist,
  registerNewUserRole,
  getRoleById,
  getAllUserRoles,
  updateUserRole,
  deleteRole,
  verifyUserScopeExist,
  registerNewUserScope,
  getScopeById,
  getAllUserScopes,
};
