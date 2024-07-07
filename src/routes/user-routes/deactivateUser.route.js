'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-finance-service';
import controller from '../../controllers/index.js';
import { sendMail } from '../../utils/request-external-svc.js';

const header = 'route: deactivate-user';
const msg = 'Deactivate user router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userController = controller.userController;

// API Function
const deactivateUser = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg, ['password']);

    try {
        const userId = req.params.userId;
        const payload = req.body;

        log.info('Call controller function to validate payload');
        const isValidPayload = userController.validateDeactivateUserPayload(payload);
        if (!isValidPayload.isValid) {
            throw isValidPayload;
        }

        log.info(`Call controller function to check if user exists for provided id : ${userId}`);
        const userExists = await userController.checkUserById(userId);
        if (!userExists.isValid) {
            throw userExists;
        }

        log.info('Call controller function to validate the user credentials');
        const credentialsValid = await userController.validateUserCredentials(userId, payload);
        if (!credentialsValid.isValid) {
            throw credentialsValid;
        }

        log.info('Call controller function to deactivate user');
        const updatedUser = await userController.deactivateUser(userId);
        if (!updatedUser.isValid) {
            throw updatedUser;
        }

        registerLog.createInfoLog('User deactivated successfully', null, updatedUser);
        log.info('Call controller function to build payload to be send to user for user deactivation confimation');
        const mailPayload = userController.sendAccountDeactivateMailPayload(updatedUser.data);
        const mailResponse = await sendMail(req.protocol, mailPayload);
        updatedUser.resMsg = `${updatedUser.resMsg} - ${mailResponse.message}`;

        log.success(`Successfully deactivated user in db for provided user id : ${userId}`);
        res.status(responseCodes[updatedUser.resType]).json(
            buildApiResponse(updatedUser)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with deactivate user router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default deactivateUser;
