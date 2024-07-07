'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-finance-service';
import controller from '../../controllers/index.js';
import { sendMail } from '../../utils/request-external-svc.js';

const header = 'route: verify-user';
const msg = 'Verify User router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userController = controller.userController;

// API Function
const verifyUser = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const verificationCode = req.body.verificationCode;

        log.info('Call controller function to validate payload');
        const isValidPayload = userController.validateUserVerificationPayload(verificationCode);
        if (!isValidPayload.isValid) {
            throw isValidPayload;
        }

        log.info('Call controller function to check if user exists');
        const userExists = await userController.checkUserById(userId);
        if (!userExists.isValid) {
            throw userExists;
        }

        log.info('Call controller function to verify user');
        const userValidated = await userController.verifyUser({userId, verificationCode});
        if (!userValidated.isValid) {
            throw userValidated;
        }

        registerLog.createInfoLog('New User verification completed successfully', null, userValidated);
        log.info('Call controller function to build payload to be send to user for verification completion');
        const mailPayload = userController.sendVerificationSuccessfulMailPayload(userValidated.data);

        const mailResponse = await sendMail(req.protocol, mailPayload);
        userValidated.resMsg = `${userValidated.resMsg} - ${mailResponse.message}`;

        log.success(`User Verification completed successfully`);
        res.status(responseCodes[userValidated.resType]).json(
            buildApiResponse(userValidated)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with verify user router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default verifyUser;
