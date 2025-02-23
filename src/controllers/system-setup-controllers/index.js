'use strict';

import { getAllServiceConfig, getServiceDetail } from './getServiceConfig.controller.js';
import { validateNewConfig, registerNewService } from './registerServiceConfig.controller.js';
import { validateConfigBeforeUpdate, updateExistingService } from './updateServiceConfig.controller.js';

export default {
    getAllServiceConfig,
    getServiceDetail,
    validateNewConfig,
    registerNewService,
    validateConfigBeforeUpdate,
    updateExistingService
};
