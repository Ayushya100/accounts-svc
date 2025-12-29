'use strict';

import { verifyUsernameEmailAlreadyTaken, registerNewUser } from './registerUser.controller.js';
import { getUserInfoById } from './getUserInfo.controller.js';
import { verifyUserToken } from './verifyUser.controller.js';

export default {
  verifyUsernameEmailAlreadyTaken,
  registerNewUser,
  getUserInfoById,
  verifyUserToken,
};
