'use strict';

import { buildApiResponse, responseCodes, logger } from 'lib-finance-service';
import controller from '../../controllers/index.js';

const header = 'route: get-user-scope-info';
const msg = 'Get user scope info router started';

const log = logger(header);
const dashboardController = controller.dashboardController;

// API Function
const getUserScopeInfo = async(req, res, next) => {
    log.info(msg);

    try {
        const roleId = req.params.roleId;
        const scopeId = req.params.scopeId;

        log.info('Call controller function to check if user role exists in db');
        const userRoleInfo = await dashboardController.getUserRoleById(roleId);
        if (!userRoleInfo.isValid) {
            throw userRoleInfo;
        }

        let userScopeInfo;
        if (scopeId) {
            log.info(`Call controller function to retrieve the user scope info for requested user scope id : ${scopeId}`);
            userScopeInfo = await dashboardController.getUserScopeById(roleId, scopeId);
        } else {
            log.info('Call controller function to retrieve all user scopes info');
            userScopeInfo = await dashboardController.getAllUserScope(roleId);
        }

        if (!userScopeInfo.isValid) {
            throw userScopeInfo;
        }

        log.success('Successfully retrieved requested user scope records from db');
        res.status(responseCodes[userScopeInfo.resType]).json(
            buildApiResponse(userScopeInfo)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with get user scope router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default getUserScopeInfo;
