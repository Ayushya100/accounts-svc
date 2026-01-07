'use strict';

import { verifyUsernameEmailAlreadyTaken, registerNewUser } from './registerUser.controller.js';
import { getUserInfoById, getUserInfoByIdentity, getUserDetailInfoById } from './getUserInfo.controller.js';
import { verifyUserToken } from './verifyUser.controller.js';
import { loginUserVerification, grantUserAccess } from './login.controller.js';
import { logout } from './logout.controller.js';
import { isTokenAvailable } from './refreshToken.controller.js';
import { forgotPasswordRequest } from './forgotPassword.controller.js';

export default {
  verifyUsernameEmailAlreadyTaken,
  registerNewUser,
  getUserInfoById,
  verifyUserToken,
  getUserInfoByIdentity,
  loginUserVerification,
  getUserDetailInfoById,
  logout,
  isTokenAvailable,
  grantUserAccess,
  forgotPasswordRequest,
};
