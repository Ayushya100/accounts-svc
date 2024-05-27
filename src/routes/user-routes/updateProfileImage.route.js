'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-finance-service';
import controller from '../../controllers/index.js';

const header = 'route: update-profile-image';
const msg = 'Update profile image router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userController = controller.userController;

// API Function
const updateProfileImage = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const profileImagePath = req.file?.path;

        log.info('Call controller function to validate payload');
        const isValidPayload = userController.validateProfileImagePayload(profileImagePath);
        if (!isValidPayload.isValid) {
            throw isValidPayload;
        }

        log.info(`Call controller function to check if user exists for provided id : ${userId}`);
        const userExists = await userController.checkUserById(userId);
        if (!userExists.isValid) {
            throw userExists;
        }

        log.info('Call controller function to update profile image');
        const updatedProfileImage = await userController.updateProfileImage(userExists, userId, profileImagePath);
        if (!updatedProfileImage.isValid) {
            throw updatedProfileImage;
        }
        registerLog.createInfoLog('User image updated successfully', null, updatedProfileImage);

        log.success(`Successfully updated profile image in db for provided user id : ${userId}`);
        res.status(responseCodes[updatedProfileImage.resType]).json(
            buildApiResponse(updatedProfileImage)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with update profile image router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default updateProfileImage;
