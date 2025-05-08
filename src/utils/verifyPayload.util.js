'use strict';

const verifyCategories = (categoryType, options) => {
  if ((categoryType === 'toggle' || categoryType === 'singleselect' || categoryType === 'multiselect') && options.length === 0) {
    return 'Options value cannot be null';
  } else if (categoryType === 'toggle' && options.length !== 2) {
    return '2 toggle options required';
  }
};

const verifyCategoryValue = (categoryType, options, value) => {
  if ((categoryType === 'toggle' || categoryType === 'singleselect' || categoryType === 'multiselect') && !options.includes(value)) {
    return 'Value is not present in the provided options';
  }
};

const verifyDashboardCategoryPayload = (payload) => {
  let validationResult = '';
  validationResult = verifyCategories(payload.categoryType, payload.options);
  if (validationResult) {
    return {
      status: 400,
      message: validationResult,
      data: [],
      errors: [],
      stack: 'verifyDashboardCategoryPayload function call',
      isValid: false,
    };
  }

  validationResult = verifyCategoryValue(payload.categoryType, payload.options, payload.value);
  if (validationResult) {
    return {
      status: 400,
      message: validationResult,
      data: [],
      errors: [],
      stack: 'verifyDashboardCategoryPayload function call',
      isValid: false,
    };
  }

  return {
    isValid: true,
  };
};

export { verifyDashboardCategoryPayload };
