const {expect} = require('chai');
const constants = require('../lib/constants');

const CONSTANTS_MOCK = {
  CONVERSATION_STATUS: {
    ACTIVE: 'active',
    PAUSED: 'pending'
  },
  DEFAULT_EXPIRE_TIME: 60 * 1000,
  CONVERSATION_SCHEMA_TYPE: {
    DYNAMIC: 'dynamic',
    JSON_SCHEMA: 'object',
    CUSTOM: 'custom'
  },
  RESPONSE_CODE: {
    DEFAULT_ERROR: {
      code: 'error',
      msg: 'Operation error.'
    },
    DEFAULT_SUCCESS: {
      code: 'ok',
      msg: 'Success.'
    }
  }
};

describe('Constants tests', function() {
  it('All constant test', function() {
    expect(constants).to.deep.eql(CONSTANTS_MOCK);
  });
});