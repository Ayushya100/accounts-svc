'use strict';

import { logger } from 'lib-finance-service';

const header = 'util: format-fields';

const log = logger(header);

const filterFields = (filterOptions) => {
    log.info('Format Filter fields execution started');
    let fields = null;
    if (filterOptions) {
        const filterValues = JSON.parse(filterOptions);

        if (filterValues.fields) {
            fields = filterValues.fields.split(',').map(field => field.trim()).join(' ');
        }
    }

    log.info('Format filter fields execution completed');
    return fields;
}

export {
    filterFields
};
