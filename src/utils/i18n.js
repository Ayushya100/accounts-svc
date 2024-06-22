'use strict';

import { getUserContext } from 'lib-finance-service';
import fs from 'fs';

const loadTranslationFile = () => {
    const userLang = getUserContext().userLang;
    let translation = fs.readFileSync(`src/assets/i18n/${userLang}.json`, 'utf-8', (err, res) => {
        return res;
    });
    return JSON.parse(translation);
}

const translate = (routePrefix, text) => {
    const translations = loadTranslationFile();
    
    if (translations.hasOwnProperty(routePrefix) && translations[routePrefix].hasOwnProperty(text)) {
        return translations[routePrefix][text];
    }
    return null;
}

export {
    translate
};
