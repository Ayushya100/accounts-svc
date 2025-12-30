'use strict';

import { verifyUsernameEmailAlreadyTaken, registerNewUser } from './registerUser.controller.js';
import { getUserInfoById, getUserInfoByIdentity, getUserDetailInfoById } from './getUserInfo.controller.js';
import { verifyUserToken } from './verifyUser.controller.js';
import { loginUserVerification } from './login.controller.js';

export default {
  verifyUsernameEmailAlreadyTaken,
  registerNewUser,
  getUserInfoById,
  verifyUserToken,
  getUserInfoByIdentity,
  loginUserVerification,
  getUserDetailInfoById,
};
