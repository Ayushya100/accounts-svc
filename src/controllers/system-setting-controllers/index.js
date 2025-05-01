'use strict';

import { verifyUserRoleExist, registerNewUserRole } from './registerUserRole.controller.js';
import { getRoleById, getAllUserRoles } from './getUserRole.controller.js';
import { updateUserRole } from './updateUserRole.controller.js';
import { deleteRole } from './deleteUserRole.controller.js';

export default {
  verifyUserRoleExist,
  registerNewUserRole,
  getRoleById,
  getAllUserRoles,
  updateUserRole,
  deleteRole,
};
