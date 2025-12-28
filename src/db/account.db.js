'use strict';

import { db } from 'common-svc-lib';
import { DBQuery } from './index.js';
import { fieldMappings } from '../utils/index.js';

class AccountDB extends DBQuery {
  constructor() {
    super();
    this.tables = {
      USERS: 'USERS',
      USER_METADATA: 'USER_METADATA',
    };
  }

  // Query Functions
  async isUsernameEmailInUse(username, emailId) {
    const query = `SELECT ID FROM ${this.tables['USERS']} WHERE USERNAME = ? OR EMAIL_ID = ?;`;
    const params = [username, emailId];

    return db.execute(query, params);
  }

  async registerNewUser(payload) {
    const query = this.insertQuery(this.tables['USERS'], fieldMappings.userMappingFields, payload);
    const params = [payload.first_name, payload.last_name, payload.username, payload.email_id, payload.password, payload.role_id, payload.login_type];
    return db.execute(query, params);
  }

  async getUserInfo(userId) {
    const query = `SELECT U.ID, U.ROLE_ID, R.ROLE_CD, U.FIRST_NAME, U.LAST_NAME, U.USERNAME, U.EMAIL_ID
            , U.LOGIN_TYPE, U.IS_VERIFIED, U.CREATED_DATE, U.MODIFIED_DATE, U.LOGIN_COUNT, U.LAST_LOGIN
            FROM USERS U
            INNER JOIN USER_ROLE R ON R.ID = U.ROLE_ID AND R.IS_DELETED = false
            WHERE U.ID = ? AND U.IS_DELETED = false;`;
    const params = [userId];
    return db.execute(query, params);
  }

  async registerEmailVerification(userId, verificationCode, verificationCodeExpiry) {
    let query = `SELECT ID FROM ${this.tables['USER_METADATA']} WHERE USER_ID = ?;`;
    let params = [userId];
    let record = await db.execute(query, params);

    let payload = {
      verification_token: verificationCode,
      verification_token_exp: verificationCodeExpiry,
    };
    params = [verificationCode, verificationCodeExpiry];

    if (record.rowCount === 0) {
      payload.user_id = userId;
      params.push(userId);
      query = this.insertQuery(this.tables['USER_METADATA'], fieldMappings.userMetadataMappingField, payload);
    } else {
      query = this.updateQuery(this.tables['USER_METADATA'], fieldMappings.userMetadataMappingField, payload, [id]);
      params.push(record.rows[0].id);
    }

    return db.execute(query, params);
  }
}

export default new AccountDB();
