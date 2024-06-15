'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-finance-service';
import controller from '../../controllers/index.js';

const header = 'route: sync-system-setup';
const msg = 'Sync system setup router started';

const log = logger(header);
const setupController = controller.setupController;

// API Function
const syncSystemSetup = async(req, res, next) => {
    log.info(msg);

    try {
        log.info('Call controller function to perform default setups for service routes, role scopes, user roles, and dashboard settings');
        const setup = await setupController.syncSetup();
        if (!setup.isValid) {
            throw setup;
        }

        log.success(`Successfully completed setup sync for required setups`);
        res.status(responseCodes[setup.resType]).json(
            buildApiResponse(setup)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with deactivate user router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default syncSystemSetup;
