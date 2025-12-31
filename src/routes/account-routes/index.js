'use strict';

import registerUser from './registerUser.route.js';
import verifyUser from './verifyUser.route.js';
import loginUser from './login.route.js';
import userInfo from './userInfo.route.js';
import logoutUser from './logout.route.js';

export default {
  registerUser,
  verifyUser,
  loginUser,
  userInfo,
  logoutUser,
};
