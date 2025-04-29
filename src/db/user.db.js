'use strict';

import { exec } from 'finance-lib';

const fetchDefaultUserRole = async () => {
  const query = `SELECT ID, ROLE_CD, ROLE_DESC, IS_ACTIVE, IS_DEFAULT
        FROM USER_ROLE
        WHERE IS_DELETED = false AND IS_ACTIVE = true AND IS_DEFAULT = true;`;

  return await exec(query);
};

const isUsernameEmailInUse = async (username, emailId) => {
  const query = `SELECT ID, FIRST_NAME, USERNAME, EMAIL_ID, IS_DELETED
        FROM USERS
        WHERE IS_DELETED = false AND USERNAME = ? AND EMAIL_ID = ?`;

  const params = [username, emailId];

  return await exec(query, params);
};

const createNewUser = async (payload) => {
  const query = `INSERT INTO USERS (ROLE_ID, FIRST_NAME, LAST_NAME, USERNAME, EMAIL_ID, PASSWORD, LOGIN_TYPE)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        RETURNING ID`;
  const params = payload;

  return await exec(query, params);
};

const getUserInfo = async (id) => {
  const query = `SELECT U.ID, R.ROLE_CD, U.FIRST_NAME, U.LAST_NAME, U.USERNAME, U.EMAIL_ID, U.LOGIN_TYPE, U.IS_VERIFIED
        , U.CREATED_DATE, U.MODIFIED_DATE, U.LOGIN_COUNT, U.LAST_LOGIN
        FROM USERS U
        INNER JOIN USER_ROLE R ON R.ID = U.ROLE_ID AND R.IS_DELETED = false
        WHERE U.ID = ? AND U.IS_DELETED = false;`;
  const params = [id];

  return await exec(query, params);
};

const registerEmailVerification = async (userId, verificationCode, verificationCodeExpiry) => {
  let query = `SELECT ID FROM USER_METADATA WHERE USER_ID = ?`;
  let params = [userId];
  let record = await exec(query, params);

  if (record.rowCount === 1) {
    query = `UPDATE USER_METADATA SET VERIFICATION_TOKEN = ?, VERIFICATION_TOKEN_EXP = ?
      WHERE ID = ?
      RETURNING VERIFICATION_TOKEN, VERIFICATION_TOKEN_EXP;`;
    params = [verificationCode, verificationCodeExpiry, record.rows[0].id];
    record = await exec(query, params);
  } else {
    query = `INSERT INTO USER_METADATA (USER_ID, VERIFICATION_TOKEN, VERIFICATION_TOKEN_EXP)
      VALUES (?, ?, ?)
      RETURNING VERIFICATION_TOKEN, VERIFICATION_TOKEN_EXP;`;
    params = [userId, verificationCode, verificationCodeExpiry];
    record = await exec(query, params);
  }

  return record;
};

const fetchUserMetaInfo = async (userId) => {
  let query = `SELECT ID, USER_ID, VERIFICATION_TOKEN, VERIFICATION_TOKEN_EXP, FORGOT_PASSWORD_TOKEN, FORGOT_PASSWORD_TOKEN_EXP
    , CREATED_DATE, MODIFIED_DATE
    FROM USER_METADATA
    WHERE IS_DELETED = false AND USER_ID = ?`;
  let params = [userId];

  return await exec(query, params);
};

const verifyUserEmail = async (userId) => {
  let query = `UPDATE USER_METADATA SET VERIFICATION_TOKEN = NULL, VERIFICATION_TOKEN_EXP = now()
    WHERE USER_ID = ?`;
  const params = [userId];
  await exec(query, params);

  query = `UPDATE USERS SET IS_VERIFIED = true
    WHERE ID = ?
    RETURNING IS_VERIFIED`;
  return await exec(query, params);
};

const getUserInfoByUsernameOrPassword = async (usernameEmail) => {
  const query = `SELECT U.ID, R.ROLE_CD, U.FIRST_NAME, U.LAST_NAME, U.USERNAME, U.EMAIL_ID, U.LOGIN_TYPE, U.IS_VERIFIED
        , U.CREATED_DATE, U.MODIFIED_DATE, U.LOGIN_COUNT, U.LAST_LOGIN, U.IS_DELETED
        FROM USERS U
        INNER JOIN USER_ROLE R ON R.ID = U.ROLE_ID AND R.IS_DELETED = false
        WHERE (U.USERNAME = ? OR U.EMAIL_ID = ?) AND U.IS_DELETED = false;`;
  const params = [usernameEmail, usernameEmail];

  return await exec(query, params);
};

const getUserPasskey = async (userId) => {
  const query = `SELECT password FROM USERS WHERE ID = ?`;
  const params = [userId];
  return await exec(query, params);
};

const storeUserToken = async (userId, token, lastLogin) => {
  let query = `UPDATE USER_METADATA SET REFRESH_TOKEN = ?
    WHERE USER_ID = ?`;
  let params = [token, userId];
  await exec(query, params);

  if (lastLogin) {
    query = `UPDATE USERS SET LAST_LOGIN = ?, LOGIN_COUNT = LOGIN_COUNT + 1
      WHERE ID = ?`;
    params = [lastLogin, userId];
    await exec(query, params);
  }

  return true;
};

const getUserDtl = async (userId) => {
  const query = `SELECT U.ID, R.ROLE_DESC, U.FIRST_NAME, U.LAST_NAME, U.USERNAME, U.EMAIL_ID, U.GENDER, U.DOB
    , U.CONTACT_NUMBER, U.PROFILE_IMG_URI, U.IS_VERIFIED, U.LAST_LOGIN, U.CREATED_DATE, U.MODIFIED_DATE
    FROM USERS U
    INNER JOIN USER_ROLE R ON R.ID = U.ROLE_ID AND R.IS_DELETED = false
    WHERE U.IS_DELETED = false AND U.IS_VERIFIED = true AND U.ID = ?`;
  const params = [userId];

  return await exec(query, params);
};

export {
  fetchDefaultUserRole,
  isUsernameEmailInUse,
  createNewUser,
  getUserInfo,
  registerEmailVerification,
  fetchUserMetaInfo,
  verifyUserEmail,
  getUserInfoByUsernameOrPassword,
  getUserPasskey,
  storeUserToken,
  getUserDtl,
};
