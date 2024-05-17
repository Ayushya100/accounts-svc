'use strict';

import {
    buildApiResponse,
    responseCodes,
    logger,
    getUserContext
} from 'lib-finance-service';
import controller from '../../controllers/index.js';

const header = 'route: delete-user-scope';
const msg = 'Delete user scope router started';

const log = logger(header);
const dashboardController = controller.dashboardController;

// API Function
const deleteUserScope = async(req, res, next) => {
    log.info(msg);

    try {
        const userContext = getUserContext();
        const roleId = req.params.roleId;
        const scopeId = req.params.scopeId;
        const userId = userContext.userId || req.user?.userId;

        log.info('Call controller function to check if user scope exists in db');
        const userScopeInfo = await dashboardController.getUserScopeById(roleId, scopeId);
        if (!userScopeInfo.isValid) {
            throw userScopeInfo;
        }

        log.info(`Call controller function to delete user scope for requested user scope if : ${scopeId}`);
        const updatedInfo = await dashboardController.deleteUserScope(userId, scopeId);
        if (!updatedInfo.isValid) {
            throw updatedInfo;
        }

        log.success('Successfully deleted user scope from db');
        res.status(responseCodes[updatedInfo.resType]).json(
            buildApiResponse(updatedInfo)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with db to delete user scope router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default deleteUserScope;
