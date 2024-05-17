'use strict';

import { buildApiResponse, responseCodes, logger } from 'lib-finance-service';
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

        log.info('Call controller function to validate payload');
        const isValidPayload = dashboardController.validateNewUserRolePayload(payload);
        if (!isValidPayload.isValid) {
            throw isValidPayload;
        }

        log.info('Call controller function to check for existing user role with same role code');
        const isUserRoleAvailable = await dashboardController.isUserRoleAvailable(payload);
        if (!isUserRoleAvailable.isValid) {
            throw isUserRoleAvailable;
        }

        if (payload.isDefault === true) {
            log.info('Call controller function to check for existing default user role');
            const isDefaultUserAvailable = await dashboardController.isDefaultUserAvailable();
            if (isDefaultUserAvailable.isValid) {
                payload.isDefault = false;
            }
        }


        log.info('Call controller function to register new user role started');
        const userRoleCreated = await dashboardController.createUserRole(payload);
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
