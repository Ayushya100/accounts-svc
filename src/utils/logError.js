'use strict';

const logError = (err) => {
    if (err.status === 500) {
        return 'Some error occurred while working with get service configuration router function';
    } else {
        return 'error', `Error occurred while processing the request at router level! Error : ${err.status} - ${err.message}`;
    }
}

export {
    logError
};
