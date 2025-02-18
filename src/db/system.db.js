'use strict';

import { exec } from 'lib-finance-svc';

const fetchServiceDetail = async(svcId = '') => {
    try {
        let query = `SELECT id, microservice, environment, protocol, port, created_on, modified_on
            FROM svc_configs
            WHERE is_deleted = false`;
        const params = [];

        if (svcId !== '') {
            query += ' AND id = ?';
            params.push(svcId);
        }
        
        const result = await exec(query, params);
        return result;
    } catch (err) {
        console.log(err);
    }
}

export {
    fetchServiceDetail
};
