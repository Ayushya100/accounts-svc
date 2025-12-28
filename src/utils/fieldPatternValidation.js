'use strict';

const patterns = {
  username: /^[a-zA-Z0-9]{4,24}$/,
  email_id: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  password: /^[a-zA-Z0-9@_.&*#$]{8,32}$/,
};

const validateFields = (payload, fields) => {
  for (const field of fields) {
    const result = patterns[field].test(payload[field]);
    if (!result) {
      return `${field} does not match with the required pattern`;
    }
  }
  return true;
};

export default validateFields;
