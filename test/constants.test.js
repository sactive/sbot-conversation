const {expect} = require('chai');
const constants = require('../lib/constants');

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
  DEFAULT_EXPIRE_TIME: 60 * 1000
};

describe('Constants tests', function() {
  it('All constant test', function() {
    expect(CONSTANTS_MOCK).to.eql(constants);
  });
});