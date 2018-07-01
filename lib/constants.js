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

module.exports = {
  CONVERSATION_STATUS,
  DEFAULT_EXPIRE_TIME,
  CONVERSATION_SCHEMA_TYPE
};
