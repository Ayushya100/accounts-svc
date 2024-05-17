'use strict';

import { buildApiResponse, responseCodes, logger } from 'lib-finance-service';
import controller from '../../controllers/index.js';

const header = 'route: create-user-scope';
const msg = 'Create new user scope in system started';

const log = logger(header);
const dashboardController = controller.dashboardController;

// API Function
const createScope = async(req, res, next) => {
    log.info(msg);

    try {
        const payload = req.body;

        log.info('Call controller function to validate payload');
        const isValidPayload = dashboardController.validateNewScopePayload(payload);
        if (!isValidPayload.isValid) {
            throw isValidPayload;
        }

        log.info(`Call controller function to check if user role for provided id (${payload.roleId}) available`);
        const userRoleAvailable = await dashboardController.isUserRoleByIdAvailable(payload.roleId);
        if (!userRoleAvailable.isValid) {
            throw userRoleAvailable;
        }

        log.info(`Call controller function to check for existing user scope with same scope code : ${payload.scope}`);
        const existingScope = await dashboardController.isUserScopeAvailable(payload);
        if (!existingScope.isValid) {
            throw existingScope;
        }

        log.info('Call controller function to register new user scope started');
        const newScope = await dashboardController.createUserScope(payload);
        if (!newScope.isValid) {
            throw newScope;
        }

        log.success(`Successfully registered new user scope (${payload.scope}) in db`);
        res.status(responseCodes[newScope.resType]).json(
            buildApiResponse(newScope)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with register user scope router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default createScope;
