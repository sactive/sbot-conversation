require('coffee-script/register');
const {expect} = require('chai');
const conversationSchema = require('../lib/conversation_schema');
const {Robot} = require('hubot');
const robot = new Robot('hubot/src/adapters', 'shell');

const DYNAMIC_SCHEMA_MOCK = {
  onCompleteMessage: 'Create user successfully!! Thanks for reporting this.',
  type: 'dynamic',
  steps: [
    {
      question: 'Start create a user \nPlease enter your user name.',
      answer: {
        type: 'text',
        validation: {
          'description': 'full name',
          'type': 'string',
          'minLength': 8
        }
      },
      required: true
    },
    {
      question: 'Please enter your user email.',
      answer: {
        type: 'text',
        validation: {
          'description': 'email address',
          'type': 'string',
          'format': 'email',
          'maxLength': 64
        }
      },
      required: true
    },
    {
      question: 'Please enter employee Num.',
      answer: {
        type: 'text',
        validation: {
          'description': 'employee Number',
          'type': 'integer',
          'minimum': 100,
          'maximum': 600
        }
      },
      required: false
    },
    {
      question: 'Please enter gender enum[female, male, unspecified]',
      answer: {
        type: 'choice',
        options: [
          {
            match: 'unspecified'
          },
          {
            match: 'male'
          },
          {
            match: 'female'
          }
        ]
      },
      required: false
    }
  ]
};

const JSON_SCHEMA_MOCK = {
  'type': 'object',
  'required': [
    'name',
    'email'
  ],
  'properties': {
    'name': {
      'description': 'full name',
      'type': 'string',
      'minLength': 8
    },
    'email': {
      'description': 'email address',
      'type': 'string',
      'format': 'email',
      'maxLength': 64
    },
    'employeeNum': {
      'description': 'employee Number',
      'type': 'integer',
      'minimum': 100,
      'maximum': 600
    },
    'gender': {
      'description': 'gender',
      'type': 'enum',
      'default': 'unspecified',
      'enum': [
        'unspecified',
        'male',
        'female'
      ]
    }
  }
};

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