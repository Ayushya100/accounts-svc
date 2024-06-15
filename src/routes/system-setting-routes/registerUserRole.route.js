'use strict';

import {
    buildApiResponse,
    responseCodes,
    logger,
    getUserContext
} from 'lib-finance-service';
import controller from '../../controllers/index.js';

const header = 'route: register-user-role';
const msg = 'Register new user role in system started';

const log = logger(header);
const dashboardController = controller.dashboardController;

// API Function
const registerUserRoleRoute = async(req, res, next) => {
    log.info(msg);

    try {
        const payload = req.body;
        const userContext = getUserContext();
        const userId = userContext.userId || req.user?.userId;

        log.info('Call controller function to validate payload');
        const isValidPayload = dashboardController.validateNewUserRolePayload(payload);
        if (!isValidPayload.isValid) {
            throw isValidPayload;
        }

        log.info('Call controller function to check for existing user role with same role code');
        const isUserRoleAvailable = await dashboardController.isUserRoleAvailable(payload);
        if (!isUserRoleAvailable.isValid && isUserRoleAvailable.resType === 'CONFLICT') {
            throw isUserRoleAvailable;
        }

        if (payload.isDefault === true) {
            log.info('Call controller function to check for existing default user role');
            const isDefaultUserAvailable = await dashboardController.isDefaultUserAvailable();
            if (isDefaultUserAvailable.isValid) {
                payload.isDefault = false;
            }
        }

        let userRoleCreated;
        if (isUserRoleAvailable.resType === 'REQUEST_COMPLETED') {
            log.info('Call controller function to register new user role started');
            userRoleCreated = await dashboardController.createUserRole(payload);
        } else if (isUserRoleAvailable.resType === 'SUCCESS') {
            log.info('Call controller function to restore deleted role started');
            userRoleCreated = await dashboardController.restoreRole(userId, isUserRoleAvailable.data);
        }
        if (!userRoleCreated.isValid) {
            throw userRoleCreated;
        }

        log.success(`Successfully registered new user role (${payload.roleName}) in db`);
        res.status(responseCodes[userRoleCreated.resType]).json(
            buildApiResponse(userRoleCreated)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with register user role router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default registerUserRoleRoute;
