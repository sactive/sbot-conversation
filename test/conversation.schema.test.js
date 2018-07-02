const conversationSchema = require('../lib/conversation_schema');

const DYNAMIC_SCHEMA_MOCK = {
  onCompleteMessage: 'Create user successfully!! Thanks for reporting this.',
  type: "dynamic",
  steps: [
    {
      question: "Start create a user \nPlease enter your user name.",
      answer: {
        type: "text",
        validation:{
          "description": 'full name',
          "type": 'string',
          "minLength": 8
        }
      },
      required: true
    },
    {
      question: "Please enter your user email.",
      answer: {
        type: "text",
        validation:{
          "description": 'email address',
          "type": 'string',
          "format": 'email',
          "maxLength": 64
        }
      },
      required: true
    },
    {
      question: "Please enter employee Num.",
      answer: {
        type: "text",
        validation:{
          "description": 'employee Number',
          "type": 'integer',
          "minimum": 100,
          "maximum": 600
        }
      },
      required: false
    },
    {
      question: "Please enter gender enum[female, male, unspecified]"
      answer: {
        type: "choice",
        options: [
          {
            match: "unspecified"
          },
          {
            match: "male"
          },
          {
            match: "female"
          }
        ]
      },
      required: false
    }
  ]
};

const JSON_SCHEMA_MOCK = {
  "type": 'object',
  "required": [
    'name',
    'email'
  ],
  "properties":{
    "name": {
      "description": 'full name',
      "type": 'string',
      "minLength": 8
    },
    "email": {
      "description": 'email address',
      "type": 'string',
      "format": 'email',
      "maxLength": 64
    },
    "employeeNum": {
      "description": 'employee Number',
      "type": 'integer',
      "minimum": 100,
      "maximum": 600
    },
    "gender": {
      "description": 'gender',
      "type": 'enum',
      "default": 'unspecified',
      "enum": [
        'unspecified',
        'male',
        'female'
      ]
    }
  }
};


describe('conversation schema tests', function () {
  describe('Json schema tests', function() {
    it('All constant test', function() {
      expect(CONSTANTS_MOCK).to.eql(constants);
    });
  });

  describe('Custom schema tests', function() {
    it('All constant test', function() {
      expect(CONSTANTS_MOCK).to.eql(constants);
    });
  });

  describe('Dynamic schema tests', function() {
    it('All constant test', function() {
      expect(CONSTANTS_MOCK).to.eql(constants);
    });
  });
});