'use strict';

import { db, DBQuery } from 'common-svc-lib';
import { fieldMappings } from '../utils/index.js';

class SystemDB extends DBQuery {
  constructor() {
    super();
  }

  // Query Functions
  async getUserRoleByCode(roleCode) {
    const query = `SELECT ID, ROLE_CD, ROLE_DESC, IS_ACTIVE, IS_DEFAULT, CREATED_DATE, MODIFIED_DATE
      FROM ${this.tables['USER_ROLE']}
      WHERE ROLE_CD = ? AND IS_DELETED = false;`;
    const params = [roleCode];

    return await db.execute(query, params);
  }

  async getDefaultRole() {
    const query = `SELECT ID FROM ${this.tables['USER_ROLE']}
      WHERE IS_DELETED = false AND IS_ACTIVE = true AND IS_DEFAULT = true;`;
    return await db.execute(query);
  }

  async registerNewRole(payload) {
    const query = this.insertQuery('USER_ROLE', fieldMappings.userRoleMappingFields, payload);
    const params = [payload.role_code, payload.role_desc, payload.is_active, payload.is_default];
    return await db.execute(query, params);
  }

  async deactivateRole(roleId) {
    const updateRec = { IS_DEFAULT: false };
    const whereRec = {
      ID: '?',
      IS_DELETED: false,
    };

    const query = this.updateQuery('USER_ROLE', fieldMappings.userRoleMappingFields, updateRec, whereRec);
    const params = [roleId];
    return await db.execute(query, params);
  }

  async getUserRole(roleId = null) {
    let query = `SELECT ID, ROLE_CD, ROLE_DESC, IS_ACTIVE, IS_DEFAULT, CREATED_DATE, MODIFIED_DATE
      FROM ${this.tables['USER_ROLE']}
      WHERE IS_DELETED = false`;
    let params = [];

    if (roleId) {
      query += ' AND ID = ?';
      params.push(roleId);
    }

    return await db.execute(query, params);
  }

  async getDefaultUserRole() {
    const query = `SELECT ID FROM ${this.tables['USER_ROLE']}
      WHERE IS_DELETED = false AND IS_ACTIVE = true AND IS_DEFAULT = true;`;
    return await db.execute(query);
  }

  async getUserScope(roleId = null, scopeId = null) {
    let query = 'SELECT S.ID, S.SCOPE_CD, S.SCOPE_DESC';
    const params = [];

    if (roleId) {
      query += ` FROM ${this.tables['ROLE_SCOPE']} R
        INNER JOIN ${this.tables['USER_SCOPE']} S ON S.ID = R.SCOPE_ID AND S.IS_DELETED = false
        WHERE R.ROLE_ID = ? AND R.IS_DELETED = false;`;
      params.push(roleId);
    }
    if (scopeId) {
      query += `, S.CREATED_DATE, S.MODIFIED_DATE
        FROM ${this.tables['USER_SCOPE']} S
        WHERE S.ID = ? AND S.IS_DELETED = false;`;
      params.push(scopeId);
    }
    if (!roleId && !scopeId) {
      query += ` FROM ${this.tables['USER_SCOPE']} S
        WHERE S.IS_DELETED = false;`;
    }

    return await db.execute(query, params);
  }

  async getUserScopeByCode(scopeCode) {
    const query = `SELECT ID, SCOPE_CD, SCOPE_DESC, CREATED_DATE, MODIFIED_DATE
      FROM ${this.tables['USER_SCOPE']}
      WHERE SCOPE_CD = ? AND IS_DELETED = false;`;
    const params = [scopeCode];

    return await db.execute(query, params);
  }

  async registerNewScope(payload) {
    const query = this.insertQuery('USER_SCOPE', fieldMappings.userScopeMappingFields, payload);
    const params = [payload.scope_code, payload.scope_desc];
    return await db.execute(query, params);
  }

  async updateRoleDtl(roleId, payload = null, isDefault = null) {
    let updateCond;
    const whereCond = {
      ID: '?',
      IS_DELETED: false,
    };
    let params;

    if (isDefault) {
      updateCond = { IS_DEFAULT: isDefault };
      params = [roleId];
    } else {
      updateCond = {
        ROLE_DESC: '?',
        IS_ACTIVE: payload.is_active,
        IS_DEFAULT: payload.is_default,
      };
      params = [payload.role_desc, roleId];
    }

    const query = this.updateQuery('USER_ROLE', fieldMappings.userRoleMappingFields, updateCond, whereCond);

    return await db.execute(query, params);
  }

  async deleteRole(roleId) {
    const updateCond = { IS_DELETED: true };
    const whereCond = {
      ID: '?',
      IS_DELETED: false,
    };

    const query = this.updateQuery('USER_ROLE', fieldMappings.userRoleMappingFields, updateCond, whereCond);
    const params = [roleId];
    return await db.execute(query, params);
  }

  async updateScopeDtl(scopeId, payload) {
    const updateCond = {
      SCOPE_DESC: '?',
    };
    const whereCond = {
      ID: '?',
      IS_DELETED: false,
    };

    const query = this.updateQuery('USER_SCOPE', fieldMappings.userScopeMappingFields, updateCond, whereCond);
    const params = [payload.scope_desc, scopeId];
    return await db.execute(query, params);
  }

  async deleteScope(scopeId) {
    const updateCond = { IS_DELETED: true };
    const whereCond = {
      ID: '?',
      IS_DELETED: false,
    };

    const query = this.updateQuery('USER_SCOPE', fieldMappings.userScopeMappingFields, updateCond, whereCond);
    const params = [scopeId];
    return await db.execute(query, params);
  }
}

export default new SystemDB();
