const {RESPONSE_CODE} = require('./constants');

function createSuccessMessage(data) {
  if (typeof data === 'string') {
    return {
      code: RESPONSE_CODE.DEFAULT_SUCCESS.code,
      msg: data,
      data: {}
    };
  }
  return {
    code: data.code || RESPONSE_CODE.DEFAULT_SUCCESS.code,
    msg: data.msg || RESPONSE_CODE.DEFAULT_SUCCESS.msg,
    data: data.data || data
  };
}

function createErrorMessage(data) {
  return {
    code: data.code,
    msg: data.msg
  };
}

function createResponse(any) {
  if (any instanceof Error) {
    return createErrorMessage({
      code: RESPONSE_CODE.DEFAULT_ERROR.code,
      msg: any.message || RESPONSE_CODE.DEFAULT_ERROR.msg,
      stack: any.stack || null
    });
  }

  if (any.code && any.code !== RESPONSE_CODE.DEFAULT_SUCCESS.code) {
    return createErrorMessage(any);
  }

  return createSuccessMessage(any);
}
module.exports = {
  createResponse
};