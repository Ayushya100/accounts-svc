'use strict';

import { validateRegisterAccountPayload } from './validatePayload.controller.js';
import {
    checkAccountByAccNumber,
    registerAccount,
    createTask,
    sendAccountCreationMailPayload
} from './registerAccount.controller.js';
import { checkAccountByToken } from './shared.controller.js';
import { getAllUserAccount, getUserAccountByToken } from './getAccountInfo.controller.js';

export default {
    validateRegisterAccountPayload,
    checkAccountByAccNumber,
    registerAccount,
    createTask,
    checkAccountByToken,
    sendAccountCreationMailPayload,
    getAllUserAccount,
    getUserAccountByToken
};
