'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-finance-service';
import controllers from '../../controllers/index.js';
import { sendMail, translate } from '../../utils/index.js';

const header = 'route: register-account';
const msg = 'Register User Account Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userController = controllers.userController;
const paymentController = controllers.paymentController;

// API Function
const registerAccount = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const payload = req.body;

        log.info('Call controller function to validate payload');
        const isValidPayload = paymentController.validateRegisterAccountPayload(payload);
        if (!isValidPayload.isValid) {
            throw isValidPayload;
        }

        log.info('Call controller function to check if user exists or not');
        const userAvailable = await userController.checkUserById(userId);
        if (!userAvailable.isValid) {
            throw userAvailable;
        }

        log.info('Call controller function to check if account for provided account number exists or not');
        const accountAvailable = await paymentController.checkAccountByAccNumber(payload.accountNumber);
        if (!accountAvailable.isValid) {
            throw accountAvailable;
        }

        log.info('Call controller function to create new payment account for user');
        const accountInfo = await paymentController.registerAccount(userId, payload);
        if (!accountInfo.isValid) {
            throw accountInfo;
        }

        const accountType = ['SAVINGS', 'CURRENT', 'SALARY', 'NRI'];
        if (payload.task && accountType.includes(accountInfo.data.accountType)) {
            log.info(`Task cannot be created for ${accountInfo.data.accountType} type of account`);
            accountInfo.resMsg += `. ${translate('paymentRoutes', 'For provided account type, a task cannot be assigned')}`;
        } else {
            let canProceedToTask = true;
            log.info('Call controller function to validate if provided debit account is valid or not');
            const debitAccount = await paymentController.checkAccountByToken(userId, payload.task.debitFrom);
            if (!debitAccount.isValid) {
                canProceedToTask = false;
                accountInfo.resMsg += `. ${debitAccount.resMsg}`;
            }

            if (payload.task.afterEndDepositTo) {
                log.info('Call controller function to validate if provided credit account is valid or not');
                const endDepositAccount = await paymentController.checkAccountByToken(userId, payload.task.afterEndDepositTo);
                if (!endDepositAccount.isValid) {
                    canProceedToTask = false;
                    accountInfo.resMsg += `. ${endDepositAccount.resMsg}`;
                }
            }

            if (canProceedToTask) {
                log.info('Call controller function to create new account task');
                const taskInfo = await paymentController.createTask(userId, accountInfo.data, payload.task);
                accountInfo.resMsg += `. ${taskInfo.resMsg}`;
                accountInfo.data = {
                    accountData: accountInfo.data,
                    taskData: taskInfo.data
                };
            }
        }

        registerLog.createInfoLog('New account registered successfully');
        log.info('Call controller function to build payload to be send to user for confirmation');
        const mailPayload = paymentController.sendAccountCreationMailPayload(userAvailable.data, accountInfo);
        
        const mailResponse = await sendMail(mailPayload);
        accountInfo.resMsg = `${accountInfo.resMsg} - ${mailResponse.message}`;

        log.success(`Successfully registered new account and task in db`);
        res.status(responseCodes[accountInfo.resType]).json(
            buildApiResponse(accountInfo)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with register account router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default registerAccount;
