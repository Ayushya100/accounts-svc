'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-finance-service';
import controller from '../../controllers/index.js';

const header = 'route: delete-user-image';
const msg = 'Delete user image router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userController = controller.userController;

// API Function
const deleteProfileImage = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);
    
    try {
        const userId = req.params.userId;

        log.info(`Call controller function to check if user exists for provided id : ${userId}`);
        const userExists = await userController.checkUserById(userId);
        if (!userExists.isValid) {
            throw userExists;
        }

        log.info('Call controller function to delete profile image for the user');
        const imageDeleted = await userController.deleteProfileImage(userExists, userId);
        if (!imageDeleted.isValid) {
            throw imageDeleted;
        }
        registerLog.createInfoLog('User image deleted successfully', null, imageDeleted);

        log.success(`Successfully deleted profile image in db for provided user id : ${userId}`);
        res.status(responseCodes[imageDeleted.resType]).json(
            buildApiResponse(imageDeleted)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with delete profile image router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default deleteProfileImage;
