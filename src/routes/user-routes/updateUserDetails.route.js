'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-finance-service';
import controller from '../../controllers/index.js';
import { sendMail } from '../../utils/request-external-svc.js';

const header = 'route: update-user-details';
const msg = 'Update user details router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userController = controller.userController;

// API Function
const updateUserDetails = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const payload = req.body;
        
        log.info('Call controller function to validate payload');
        const isValidPayload = userController.validateUserDetailsPayload(payload);
        if (!isValidPayload.isValid) {
            throw isValidPayload;
        }

        log.info(`Call controller function to check if user exists for provided id : ${userId}`);
        const userExists = await userController.checkUserById(userId);
        if (!userExists.isValid) {
            throw userExists;
        }

        log.info('Call controller function to update user details');
        const updatedUser = await userController.updateUserDetails(userId, userExists.data, payload);
        if (!updatedUser.isValid) {
            throw updatedUser;
        }

        registerLog.createInfoLog('User details updated successfully', null, updatedUser);
        log.info('Call controller function to build payload to be send to user for details update confimation');
        const mailPayload = userController.sendUpdateDetailsMailPayload(updatedUser.data);
        const mailResponse = await sendMail(req.protocol, mailPayload);
        updatedUser.resMsg = `${updatedUser.resMsg} - ${mailResponse.message}`;

        log.success(`Successfully updated user details in db for provided user id : ${userId}`);
        res.status(responseCodes[updatedUser.resType]).json(
            buildApiResponse(updatedUser)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with update user details router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default updateUserDetails;
