'use strict';

import { _Error } from 'common-svc-lib';

const validateUpdateRoleSchema = (payload) => {
  if (!Object.hasOwn(payload, 'role_desc')) {
    throw _Error(400, "request/body must have required property 'role_desc'");
  }
  if (!Object.hasOwn(payload, 'is_default')) {
    throw _Error(400, "request/body must have required property 'is_default'");
  }
  if (!Object.hasOwn(payload, 'is_active')) {
    throw _Error(400, "request/body must have required property 'is_active'");
  }

  return true;
};

export { validateUpdateRoleSchema };
