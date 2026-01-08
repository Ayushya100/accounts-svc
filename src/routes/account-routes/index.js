'use strict';

import registerUser from './registerUser.route.js';
import verifyUser from './verifyUser.route.js';
import loginUser from './login.route.js';
import userInfo from './userInfo.route.js';
import logoutUser from './logout.route.js';
import refreshToken from './refresh.route.js';
import forgotPassword from './forgotPassword.route.js';
import requestResetPassword from './resetPassword.route.js';
import changePassword from './changePassword.route.js';
import getAllUsers from './getAllUsers.route.js';
import getUserDtlById from './getUserDtlById.route.js';

export default {
  registerUser,
  verifyUser,
  loginUser,
  userInfo,
  logoutUser,
  refreshToken,
  forgotPassword,
  requestResetPassword,
  changePassword,
  getAllUsers,
  getUserDtlById,
};
