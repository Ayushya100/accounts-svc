'use strict';

import { verifyUserRoleExist, registerNewUserRole } from './registerUserRole.controller.js';
import { getUserRoleById, getAllUserRoles } from './getUserRole.controller.js';

export default {
  verifyUserRoleExist,
  registerNewUserRole,
  getUserRoleById,
  getAllUserRoles,
};
