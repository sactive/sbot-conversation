const {expect} = require('chai');
const conversation = require('../lib');

const CONSTANTS_MOCK = {
  CONVERSATION_STATUS: {
    ACTIVE: 'active',
    PAUSED: 'pending'
  },
  CONVERSATION_SCHEMA_TYPE: {
    DYNAMIC: 'dynamic',
    JSON_SCHEMA: 'object',
    CUSTOM: 'custom'
  },
  DEFAULT_EXPIRE_TIME: 60 * 1000,
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

describe('Index tests', function () {
  it('Private constants test', function () {
    expect(CONSTANTS_MOCK).to.deep.eql(conversation.private.constants);
  });

  it('initManager should be a function', function () {
    expect(conversation.initManager).to.be.a('function');
  });

  it('Dialog should be a function', function () {
    expect(conversation.Dialog).to.be.an('function');
  });
});