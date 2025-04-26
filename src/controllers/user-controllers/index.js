'use strict';

import { verifyUsernameEmailAlreadyTaken, registerNewUser } from './registerUser.controller.js';
import { generateEmailVerificationCode, sendVerificationMailToUser } from './verificationCode.controller.js';

export default {
  verifyUsernameEmailAlreadyTaken,
  registerNewUser,
  generateEmailVerificationCode,
  sendVerificationMailToUser,
};
