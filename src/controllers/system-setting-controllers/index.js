'use strict';

import { verifyUserRoleExist, registerNewUserRole } from './registerUserRole.controller.js';
import { getRoleById, getAllUserRoles } from './getUserRole.controller.js';
import { updateUserRole } from './updateUserRole.controller.js';
import { deleteRole } from './deleteUserRole.controller.js';
import { verifyUserScopeExist, registerNewUserScope } from './registerUserScope.controller.js';
import { getScopeById, getAllUserScopes } from './getUserScope.controller.js';
import { updateUserScope } from './updateUserScope.controller.js';
import { deleteScope } from './deleteUserScope.controller.js';
import { getUnassignedScopes } from './roleScope.controller.js';

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
  updateUserScope,
  deleteScope,
  getUnassignedScopes,
};
