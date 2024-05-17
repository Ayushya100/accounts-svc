'use strict';

import {
    buildApiResponse,
    responseCodes,
    logger,
    getUserContext
} from 'lib-finance-service';
import controller from '../../controllers/index.js';

const header = 'update: update-user-scope';
const msg = 'Update user scope info router started';

const log = logger(header);
const dashboardController = controller.dashboardController;

// API Function
const updateUserScope = async(req, res, next) => {
    log.info(msg);

    try {
        const userContext = getUserContext();
        const roleId = req.params.roleId;
        const scopeId = req.params.scopeId;
        const userId = userContext.userId || req.user?.userId;
        const payload = req.body;

        log.info('Call controller function to check if user scope exists in db');
        const userScopeInfo = await dashboardController.getUserScopeById(roleId, scopeId);
        if (!userScopeInfo.isValid) {
            throw userScopeInfo;
        }

        log.info(`Call controller function to update user scope for requested user scope id : ${scopeId}`);
        const updatedInfo = await dashboardController.updatedUserScope(userId, scopeId, payload, userScopeInfo.data);
        if (!updatedInfo.isValid) {
            throw updatedInfo;
        }

        log.success('Successfully updated info for requested user scope in db');
        res.status(responseCodes[updatedInfo.resType]).json(
            buildApiResponse(updatedInfo)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with db to update user scope router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default updateUserScope;
