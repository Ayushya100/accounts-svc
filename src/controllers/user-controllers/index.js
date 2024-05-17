'use strict';

import { validateRegisterUserPayload } from './validatePayload.controller.js';
import {
    checkUserByUserNameOrEmail,
    createNewUser,
    sendVerificationMailPayload
} from './registerUser.controller.js';

export default {
    validateRegisterUserPayload,
    checkUserByUserNameOrEmail,
    createNewUser,
    sendVerificationMailPayload
};
