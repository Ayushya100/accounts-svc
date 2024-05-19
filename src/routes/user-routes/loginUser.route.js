'use strict';

import {
    buildApiResponse,
    responseCodes,
    logger,
    createNewLog
} from 'lib-finance-service';
import controller from '../../controllers/index.js';
import { COOKIE_OPTIONS } from '../../constants.js';
import { sendMail } from '../../utils/request-external-svc.js';

const header = 'route: login-user';
const msg = 'Login user router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userController = controller.userController;

// API Function
const loginUser = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg, ['password']);

    try {
        const payload = req.body;

        log.info('Call controller function to validate payload');
        const isValidPayload = userController.validateUserLoginPayload(payload);
        if (!isValidPayload.isValid) {
            throw isValidPayload;
        }

        log.info('Call controller function to check if user is an authorized user');
        const isUserValid = await userController.isUserValid(payload);
        if (!isUserValid.isValid) {
            throw isUserValid;
        }

        log.info('Call controller function to check if user is verified');
        const isUserVerified = await userController.isUserVerified(isUserValid.data);
        if (!isUserVerified.isValid && isUserVerified.resType === 'BAD_REQUEST') {
            log.info('Call controller function to build payload to be send to user for verification');
            const verificationPayload = userController.sendVerificationMailPayload(isUserVerified.data);

            await sendMail(verificationPayload);
            throw isUserVerified;
        } else if (!isUserVerified.isValid) {
            throw isUserVerified;
        }

        log.info('Call controller function to check if user is active or not');
        const activeUser = await userController.isUserActive(isUserValid.data);
        if (activeUser) {
            const reactivatePayload = userController.sendAccountReactivationMailPayload(isUserValid.data);
            await sendMail(reactivatePayload);
        }

        log.info('Call controller function to login the user and setup the tokens');
        const loggedInUser = await userController.generateAccessAndRefreshTokens(isUserValid.data._id);
        if (!loggedInUser.isValid) {
            throw loggedInUser;
        }

        log.success(`User loggedIn successfully`);
        res.status(responseCodes[loggedInUser.resType])
        .cookie('accessToken', loggedInUser.data.accessToken, COOKIE_OPTIONS)
        .cookie('refreshToken', loggedInUser.data.refreshToken, COOKIE_OPTIONS)
        .json(
            buildApiResponse(loggedInUser)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with user login router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default loginUser;
