'use strict';

import {
    buildApiResponse,
    responseCodes,
    logger,
    createNewLog
} from 'lib-finance-service';
import controller from '../../controllers/index.js';
import { sendMail } from '../../utils/index.js';

const header = 'route: register-user';
const msg = 'Register user router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userController = controller.userController;

// API Function
const registerUser = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg, ['password']);

    try {
        const payload = req.body;

        log.info('Call controller function to validate payload');
        const isValidPayload = userController.validateRegisterUserPayload(payload);
        if (!isValidPayload.isValid) {
            throw isValidPayload;
        }

        log.info('Call controller function to check if user already exists');
        const userAvailable = await userController.checkUserByUserNameOrEmail(payload);
        if (!userAvailable.isValid) {
            throw userAvailable;
        }

        log.info('Call controller function to register new user started');
        const userCreated = await userController.createNewUser(payload);
        if (!userCreated.isValid) {
            throw userCreated;
        }

        registerLog.createInfoLog('New user registered successfully', null, userCreated);
        log.info('Call controller function to build payload to be send to user for verification');
        const mailPayload = userController.sendVerificationMailPayload(userCreated.data);

        const mailResponse = await sendMail(req.protocol, mailPayload);
        userCreated.resMsg = `${userCreated.resMsg} - ${mailResponse.message}`;

        log.success(`Successfully registered new user in db`);
        res.status(responseCodes[userCreated.resType]).json(
            buildApiResponse(userCreated)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with register user router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default registerUser;
