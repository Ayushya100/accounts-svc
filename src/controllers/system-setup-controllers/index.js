'use strict';

import { verifyUserRoleExist, registerNewUserRole } from './registerUserRole.controller.js';
import { getUserRoleById, getAllUserRoles } from './getUserRole.controller.js';
import { verifyUserScopeExist, registerNewUserScope } from './registerUserScope.controller.js';
import { getUserScopeById, getAllUserScopes } from './getUserScope.controller.js';
import { updateUserRoleDtl, updateRoleDefault } from './updateUserRole.controller.js';

export default {
  verifyUserRoleExist,
  registerNewUserRole,
  getUserRoleById,
  getAllUserRoles,
  verifyUserScopeExist,
  registerNewUserScope,
  getUserScopeById,
  getAllUserScopes,
  updateUserRoleDtl,
  updateRoleDefault,
};
