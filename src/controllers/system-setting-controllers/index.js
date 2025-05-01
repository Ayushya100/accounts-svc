'use strict';

import { verifyUserRoleExist, registerNewUserRole } from './registerUserRole.controller.js';
import { getRoleById, getAllUserRoles } from './getUserRole.controller.js';
import { updateUserRole } from './updateUserRole.controller.js';

export default {
  verifyUserRoleExist,
  registerNewUserRole,
  getRoleById,
  getAllUserRoles,
  updateUserRole,
};
