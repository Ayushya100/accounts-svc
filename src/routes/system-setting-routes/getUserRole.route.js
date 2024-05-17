'use strict';

import { buildApiResponse, responseCodes, logger } from 'lib-finance-service';
import controller from '../../controllers/index.js';

const header = 'route: get-user-role-info';
const msg = 'Get user role info router started';

const log = logger(header);
const dashboardController = controller.dashboardController;

// API Function
const getUserRoleInfo = async(req, res, next) => {
    log.info(msg);

    try {
        const roleId = req.params.roleId;

        let userRoleInfo;
        if (roleId) {
            log.info(`Call controller function to retrieve the user role info for requested user role id : ${roleId}`);
            userRoleInfo = await dashboardController.getUserRoleById(roleId);
        } else {
            log.info('Call controller function to retrieve all user roles info');
            userRoleInfo = await dashboardController.getAllUserRole();
        }

        if (!userRoleInfo.isValid) {
            throw userRoleInfo;
        }

        log.success('Successfully retrieved requested user role records from db');
        res.status(responseCodes[userRoleInfo.resType]).json(
            buildApiResponse(userRoleInfo)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with get user role router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default getUserRoleInfo;
