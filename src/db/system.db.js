'use strict';

import { exec } from 'finance-lib';

const isRoleAvailable = async (roleCd) => {
  const query = `SELECT ID, ROLE_CD, ROLE_DESC, IS_ACTIVE, IS_DEFAULT, IS_DELETED
        FROM USER_ROLE
        WHERE ROLE_CD = ? AND IS_DELETED = false;`;
  const params = [roleCd];

  return exec(query, params);
};

const getDefaultRole = async () => {
  const query = `SELECT ID FROM USER_ROLE WHERE IS_DELETED = false AND IS_DEFAULT = true;`;
  return exec(query);
};

const deactivateRole = async (roleId) => {
  const query = `UPDATE USER_ROLE SET IS_DEFAULT = false WHERE ID = ? AND IS_DELETED = false;`;
  const params = [roleId];
  return exec(query, params);
};

const registerNewRole = async (payload) => {
  const query = `INSERT INTO USER_ROLE (ROLE_CD, ROLE_DESC, IS_ACTIVE, IS_DEFAULT)
        VALUES (?, ?, ?, ?)
        RETURNING ID`;
  const params = [payload.roleCode, payload.roleDesc, true, payload.default];

  return exec(query, params);
};

const getUserRoleById = async (roleId) => {
  const query = `SELECT ID, ROLE_CD, ROLE_DESC, IS_ACTIVE, IS_DEFAULT, CREATED_DATE, MODIFIED_DATE
        FROM USER_ROLE
        WHERE ID = ? AND IS_DELETED = false`;
  const params = [roleId];

  return exec(query, params);
};

const getUserRoles = async () => {
  const query = `SELECT ID, ROLE_CD, ROLE_DESC, IS_ACTIVE, IS_DEFAULT, CREATED_DATE, MODIFIED_DATE
        FROM USER_ROLE
        WHERE IS_DELETED = false`;
  return exec(query);
};

export { isRoleAvailable, getDefaultRole, deactivateRole, registerNewRole, getUserRoleById, getUserRoles };
