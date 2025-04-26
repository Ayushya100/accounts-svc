'use strict';

import { verifyUsernameEmailAlreadyTaken, registerNewUser } from './registerUser.controller.js';
import { generateEmailVerificationCode, sendVerificationMailToUser } from './verificationCode.controller.js';
import { getUserInfoById } from './getUserInfo.controller.js';
import { verifyUserToken } from './verifyUser.controller.js';

export default {
  verifyUsernameEmailAlreadyTaken,
  registerNewUser,
  generateEmailVerificationCode,
  sendVerificationMailToUser,
  getUserInfoById,
  verifyUserToken,
};
