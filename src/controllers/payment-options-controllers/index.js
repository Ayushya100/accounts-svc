'use strict';

import { validateRegisterAccountPayload } from './validatePayload.controller.js';
import {
    checkAccountByAccNumber,
    registerAccount,
    createTask,
    sendAccountCreationMailPayload
} from './registerAccount.controller.js';
import { checkAccountByToken } from './shared.controller.js';

export default {
    validateRegisterAccountPayload,
    checkAccountByAccNumber,
    registerAccount,
    createTask,
    checkAccountByToken,
    sendAccountCreationMailPayload
};
