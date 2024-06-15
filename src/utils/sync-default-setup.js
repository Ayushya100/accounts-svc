'use strict'

import fs from 'fs';
import path from 'path';
import { logger } from 'lib-finance-service';

const header = 'Util: Read file';
const log = logger(header);

const readJsonFileSync = (fileName) => {
    log.info('Execution for reading file started');
    const jsonData = fs.readFileSync(`src/assets/default-setup/${fileName}.json`, 'utf8');
    log.info('File reading completed successfully');
    return JSON.parse(jsonData);
}

export {
    readJsonFileSync
};
