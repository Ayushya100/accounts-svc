'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-finance-service';
import { translate } from '../../utils/index.js';

const header = 'controller: update-user-role';
const log = logger(header);

const updateUserRole = async(userId, roleId, payload, roleInfo) => {
    try {
        log.info('Execution for updating user role info controller started');
        const queryPayload = {
            roleCode: payload.roleCode ? payload.roleCode.toUpperCase() : roleInfo.roleCode,
            roleName: payload.roleName || roleInfo.roleName,
            isActive: payload.isActive || roleInfo.isActive
        };

        log.info('Call db query to update user role info');
        const userRoleDetails = await dbConnect.updateUserRoleById(userId, roleId, queryPayload);

        log.info('Execution for updating user role info completed successfully');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: translate('settingRoutes', 'User role updated'),
            data: userRoleDetails,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to updating user role record');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('settingRoutes', 'Some error occurred while working with db to update user role'),
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    updateUserRole
};
