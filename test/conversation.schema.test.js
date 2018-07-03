require('coffee-script/register');
const {expect} = require('chai');
const conversationSchema = require('../lib/conversation_schema');
const {DYNAMIC_SCHEMA_MOCK, JSON_SCHEMA_MOCK} = require('./mock/schemas');
const {Robot} = require('hubot');
const robot = new Robot('hubot/src/adapters', 'shell');


let dynamicSchemaMock = null;
let jsonSchemaMock = null;
describe('conversation schema tests', function () {
  before(function () {
    dynamicSchemaMock = new conversationSchema(robot, 'dynamic', DYNAMIC_SCHEMA_MOCK);
    jsonSchemaMock = new conversationSchema(robot, 'json', JSON_SCHEMA_MOCK);
    dynamicSchemaMock.init();
    jsonSchemaMock.init();
  });

  describe('Json schema tests', function () {
    it('Validate all input test', function () {
      let result = jsonSchemaMock.validateAll({name: 'test'});
      expect(result.status).to.eql(false);
      expect(result.message).to.have.string('instance requires property "email"');
    });
  });

  describe('Custom schema tests', function () {
    it('Should throw an error unsupported', function () {
      try {
        let s = new conversationSchema(robot, 'json', {type: 'custom'});
        s.init();
      } catch (e) {
        expect(e.message).to.eql('Unsupported schema type: custom');
      }
    });
  });

  describe('Dynamic schema tests', function () {
    it('Validate all Should throw an error', function () {
      try {
        let s = dynamicSchemaMock.validateAll('test');
        s.init();
      } catch (e) {
        expect(e.message).to.eql('validateAll just support type: object');
      }
    });

    it('Validate input test', function () {
      let result = jsonSchemaMock.validate(99, {
        'description': 'employee Number',
        'type': 'integer',
        'minimum': 100,
        'maximum': 600
      });
      expect(result.status).to.eql(false);
      expect(result.message).to.have.string('`99` must have a minimum value of 100');
    });
  });
});