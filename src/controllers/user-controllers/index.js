'use strict';

import { verifyUsernameEmailAlreadyTaken, registerNewUser } from './registerUser.controller.js';
import { generateEmailVerificationCode } from './verificationCode.controller.js';
import { getUserInfoById, getUserInfoByUsernameOrEmail, getUserDetailInfoById } from './getUserInfo.controller.js';
import { verifyUserToken } from './verifyUser.controller.js';
import { isVerifiedUser, verifyUserCreds, grantUserAccess } from './loginUser.controller.js';

export default {
  verifyUsernameEmailAlreadyTaken,
  registerNewUser,
  generateEmailVerificationCode,
  getUserInfoById,
  getUserInfoByUsernameOrEmail,
  verifyUserToken,
  isVerifiedUser,
  verifyUserCreds,
  grantUserAccess,
  getUserDetailInfoById,
};
