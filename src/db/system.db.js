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
  const query = `SELECT ID FROM USER_ROLE WHERE IS_DELETED = false AND IS_ACTIVE = true AND IS_DEFAULT = true;`;
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
  const query = `SELECT ID, ROLE_CD, ROLE_DESC, IS_ACTIVE, IS_DEFAULT FROM USER_ROLE WHERE IS_DELETED = false`;
  return exec(query);
};

const updateUserRoleById = async (userId, payload) => {
  const query = `UPDATE USER_ROLE SET ROLE_DESC = ?, IS_ACTIVE = ?, IS_DEFAULT = ?, MODIFIED_BY = ?
    WHERE ID = ? AND IS_DELETED = false;`;
  const params = [payload.roleDesc, payload.active, payload.default, userId, payload.id];

  return exec(query, params);
};

const deleteUserRoleById = async (userId, roleId) => {
  const query = `UPDATE USER_ROLE SET IS_DELETED = true, IS_ACTIVE = false, MODIFIED_BY = ?
    WHERE ID = ? AND IS_DELETED = false AND IS_DEFAULT = false;`;
  const params = [userId, roleId];

  return exec(query, params);
};

const isScopeAvailable = async (scopeCode) => {
  const query = `SELECT ID, SCOPE_CD, SCOPE_DESC, IS_DELETED FROM USER_SCOPE
    WHERE IS_DELETED = false AND SCOPE_CD = ?;`;
  const params = [scopeCode];

  return exec(query, params);
};

const registerNewScope = async (payload) => {
  const query = `INSERT INTO USER_SCOPE (SCOPE_CD, SCOPE_DESC)
    VALUES(?, ?)
    RETURNING ID`;
  const params = [payload.scopeCode, payload.scopeDesc];

  return exec(query, params);
};

const getUserScopeById = async (scopeId) => {
  const query = `SELECT ID, SCOPE_CD, SCOPE_DESC, CREATED_DATE, MODIFIED_DATE
    FROM USER_SCOPE
    WHERE IS_DELETED = false AND ID = ?;`;
  const params = [scopeId];

  return exec(query, params);
};

const getUserScopes = async () => {
  const query = `SELECT ID, SCOPE_CD, SCOPE_DESC FROM USER_SCOPE WHERE IS_DELETED = false;`;
  return exec(query);
};

const updateUserScopeById = async (userId, scopeId, payload) => {
  const query = `UPDATE USER_SCOPE SET SCOPE_DESC = ?, MODIFIED_BY = ?
    WHERE IS_DELETED = false AND ID = ?;`;
  const params = [payload.scopeDesc, userId, scopeId];

  return exec(query, params);
};

export {
  isRoleAvailable,
  getDefaultRole,
  deactivateRole,
  registerNewRole,
  getUserRoleById,
  getUserRoles,
  updateUserRoleById,
  deleteUserRoleById,
  isScopeAvailable,
  registerNewScope,
  getUserScopeById,
  getUserScopes,
  updateUserScopeById,
};
