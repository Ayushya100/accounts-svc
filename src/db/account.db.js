'use strict';

import { db, DBQuery } from 'common-svc-lib';
import { fieldMappings } from '../utils/index.js';

class AccountDB extends DBQuery {
  constructor() {
    super();
    this.tables = {
      USERS: 'USERS',
      USER_METADATA: 'USER_METADATA',
      USER_ROLE: 'USER_ROLE',
    };

    // General Queries
    this.userInfoQuery = `SELECT U.ID, U.ROLE_ID, R.ROLE_CD, U.FIRST_NAME, U.LAST_NAME, U.USERNAME, U.EMAIL_ID, U.LOGIN_TYPE
      , U.IS_VERIFIED, U.CREATED_DATE, U.MODIFIED_DATE, U.LOGIN_COUNT, U.LAST_LOGIN, U.IS_DELETED
      FROM ${this.tables['USERS']} U
      INNER JOIN ${this.tables['USER_ROLE']} R ON R.ID = U.ROLE_ID AND R.IS_DELETED = false
      WHERE U.IS_DELETED = false`;
  }

  // Query Functions
  async isUsernameEmailInUse(username, emailId) {
    const query = `SELECT ID FROM ${this.tables['USERS']} WHERE USERNAME = ? OR EMAIL_ID = ?;`;
    const params = [username, emailId];

    return await db.execute(query, params);
  }

  async registerNewUser(payload) {
    const query = this.insertQuery(this.tables['USERS'], fieldMappings.userMappingFields, payload);
    const params = [payload.first_name, payload.last_name, payload.username, payload.email_id, payload.password, payload.role_id, payload.login_type];
    return await db.execute(query, params);
  }

  async getUserInfo(userId) {
    const query = this.userInfoQuery + ' AND U.ID = ?';
    const params = [userId];
    return await db.execute(query, params);
  }

  async registerEmailVerification(userId, verificationCode, verificationCodeExpiry) {
    let query = `SELECT ID FROM ${this.tables['USER_METADATA']} WHERE USER_ID = ?;`;
    let params = [userId];
    let record = await db.execute(query, params);

    let payload = ['verification_token', 'verification_token_exp'];
    params = [verificationCode, verificationCodeExpiry];

    if (record.rowCount === 0) {
      payload.push('user_id');
      params.push(userId);
      query = this.insertQuery(this.tables['USER_METADATA'], fieldMappings.userMetadataMappingField, payload);
    } else {
      query = this.updateQuery(this.tables['USER_METADATA'], fieldMappings.userMetadataMappingField, payload, ['ID', 'IS_DELETED']);
      params.push(record.rows[0].id, false);
    }

    return await db.execute(query, params);
  }

  async getUserMetaInfo(userId) {
    const query = `SELECT ID, USER_ID, VERIFICATION_TOKEN, VERIFICATION_TOKEN_EXP, FORGOT_PASSWORD_TOKEN
      , FORGOT_PASSWORD_TOKEN_EXP, REFRESH_TOKEN
      FROM ${this.tables['USER_METADATA']}
      WHERE IS_DELETED = false AND USER_ID = ?;`;
    const params = [userId];

    return await db.execute(query, params);
  }

  async verifyUserEmail(userId, currentTime) {
    let updateFields = ['VERIFICATION_TOKEN', 'VERIFICATION_TOKEN_EXP'];
    let whereField = ['USER_ID', 'IS_DELETED'];

    let query = this.updateQuery(this.tables['USER_METADATA'], fieldMappings.userMetadataMappingField, updateFields, whereField);
    let params = [null, currentTime, userId, false];
    await db.execute(query, params);

    updateFields = ['IS_VERIFIED'];
    whereField = ['ID', 'IS_DELETED'];
    query = this.updateQuery(this.tables['USERS'], fieldMappings.userMappingFields, updateFields, whereField);
    params = [true, userId, false];
    await db.execute(query, params);
    return true;
  }

  async userInfoByIdentity(userIdentity) {
    const query = this.userInfoQuery + ' AND (U.USERNAME = ? OR U.EMAIL_ID = ?)';
    const params = [userIdentity, userIdentity];
    return await db.execute(query, params);
  }

  async getUserPassKey(userId) {
    const query = `SELECT PASSWORD FROM ${this.tables['USERS']} WHERE ID = ?`;
    const params = [userId];
    return await db.execute(query, params);
  }

  async storeUserLoginInfo(userId, refreshToken, lastLoginTime) {
    let query = this.updateQuery(this.tables['USER_METADATA'], fieldMappings.userMetadataMappingField, ['REFRESH_TOKEN'], ['USER_ID', 'IS_DELETED']);
    let params = [refreshToken, userId, false];
    await db.execute(query, params);

    if (lastLoginTime) {
      const updateFields = {
        LAST_LOGIN: '?',
        LOGIN_COUNT: 'LOGIN_COUNT + 1',
      };
      query = this.updateQuery(this.tables['USERS'], fieldMappings.userMappingFields, updateFields, ['ID', 'IS_DELETED']);
      params = [lastLoginTime, userId, false];
      await db.execute(query, params);
    }
    return true;
  }

  async getUserDtlInfo(userId) {
    const query = `SELECT U.ID, U.ROLE_ID, R.ROLE_CD, U.FIRST_NAME, U.LAST_NAME, U.USERNAME, U.EMAIL_ID, U.GENDER, U.DOB
      , U.CONTACT_NUMBER, U.PROFILE_IMG_URI, U.LOGIN_TYPE, U.IS_VERIFIED, U.CREATED_DATE, U.MODIFIED_DATE, U.LOGIN_COUNT
      , U.LAST_LOGIN, U.IS_DELETED
      FROM ${this.tables['USERS']} U
      INNER JOIN ${this.tables['USER_ROLE']} R ON R.ID = U.ROLE_ID AND R.IS_DELETED = false
      WHERE U.ID = ? AND U.IS_DELETED = false AND U.IS_VERIFIED = true;`;
    const params = [userId];

    return await db.execute(query, params);
  }

  async logoutUser(userId) {
    const updateFields = {
      REFRESH_TOKEN: null,
    };
    const query = this.updateQuery('USER_METADATA', fieldMappings.userMetadataMappingField, updateFields, ['USER_ID', 'IS_DELETED']);
    const params = [userId, false];

    return await db.execute(query, params);
  }
}

export default new AccountDB();
