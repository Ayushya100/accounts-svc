'use strict';

import { db, _Error } from 'common-svc-lib';

class DBQuery {
  constructor() {}

  mapArrFields(arr, mappingFields, type) {
    return arr.map((field) => {
      if (!mappingFields[field]) {
        return type === 'insert' ? field : `${field} = ?`;
      }
      return type === 'insert' ? mappingFields[field] : `${mappingFields[field]} = ?`;
    });
  }

  mapObjFields(obj, mappingFields, type) {
    const fields = Object.keys(obj);
    return fields.map((field) => {
      if (!mappingFields[field]) {
        return type === 'insert' ? field : `${field} = ${obj[field]}`;
      }
      return type === 'insert' ? mappingFields[field] : `${mappingFields[field]} = ${obj[field]}`;
    });
  }

  // Standard Functions
  insertQuery(table, mappingFields, fields) {
    let columnKeys;

    if (Array.isArray(fields)) {
      columnKeys = fields;
    } else if (fields !== null && typeof fields === 'object') {
      columnKeys = Object.keys(fields);
    } else {
      throw _Error(500, 'Fields must be an array or an object');
    }

    const columns = this.mapArrFields(columnKeys, mappingFields, 'insert');
    const placeholders = Array(columns.length).fill('?');
    return `INSERT INTO ${this.tables[table]} (${columns.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING ID`;
  }

  updateQuery(table, mappingFields, updateFields, whereFields) {
    let updateColumns;
    let whereColumns;

    if (Array.isArray(updateFields)) {
      updateColumns = this.mapArrFields(updateFields, mappingFields, 'update');
    } else if (updateFields !== null && typeof updateFields === 'object') {
      updateColumns = this.mapObjFields(updateFields, mappingFields, 'update');
    } else {
      throw _Error(500, 'Update Fields must be an array or an object');
    }

    if (Array.isArray(whereFields)) {
      whereColumns = this.mapArrFields(whereFields, mappingFields, 'update');
    } else if (whereFields !== null && typeof whereFields === 'object') {
      whereColumns = this.mapObjFields(whereFields, mappingFields, 'update');
    } else {
      throw _Error(500, 'Where Fields must be an array or an object');
    }

    return `UPDATE ${this.tables[table]} SET ${updateColumns.join(', ')}
      WHERE ${whereColumns.join(' AND ')}`;
  }
}

export default DBQuery;
