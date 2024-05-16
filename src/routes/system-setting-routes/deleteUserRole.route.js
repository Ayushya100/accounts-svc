'use strict';

import {
    buildApiResponse,
    responseCodes,
    logger,
    getUserContext
} from 'lib-finance-service';
import controller from '../../controllers/index.js';

const header = 'route: delete-user-role';
const msg = 'Delete user role router started';

const log = logger(header);
const dashboardController = controller.dashboardController;

// API Function
const deleteUserRole = async(req, res, next) => {
    log.info(msg);

    try {
        const userContext = getUserContext();
        const roleId = req.params.roleId;
        const userId = userContext.userId || req.user?.userId;

        if (!roleId) {
            throw {
                resType: 'BAD_REQUEST',
                resMsg: 'Role Id not provided',
                isValid: false
            };
        }

        log.info('Call controller function to check if user role exists in db');
        const userRoleInfo = await dashboardController.getUserRoleById(roleId);
        if (!userRoleInfo) {
            throw userRoleInfo;
        }

        log.info(`Call controller function to delete user role for requested user role id : ${roleId}`);
        const updatedInfo = await dashboardController.deleteUserRole(userId, roleId);
        if (!updatedInfo.isValid) {
            throw updatedInfo;
        }

        log.success('Successfully deleted user role from db');
        res.status(responseCodes[updatedInfo.resType]).json(
            buildApiResponse(updatedInfo)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with db to update user role router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default deleteUserRole;
