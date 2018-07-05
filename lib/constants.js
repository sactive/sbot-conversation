const CONVERSATION_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'pending'
};

const CONVERSATION_SCHEMA_TYPE = {
  DYNAMIC: 'dynamic',
  JSON_SCHEMA: 'object',
  CUSTOM: 'custom'
};

const DEFAULT_EXPIRE_TIME = 60 * 1000;

const RESPONSE_CODE = {
  DEFAULT_ERROR: {
    code: 'error',
    msg: 'Operation error.'
  },
  DEFAULT_SUCCESS: {
    code: 'ok',
    msg: 'Success.'
  }
};

module.exports = {
  CONVERSATION_STATUS,
  DEFAULT_EXPIRE_TIME,
  CONVERSATION_SCHEMA_TYPE,
  RESPONSE_CODE
};
