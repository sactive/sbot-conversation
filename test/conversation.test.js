require('coffee-script/register');

const Helper = require('hubot-test-helper');
const chai = require('chai');
const rewire = require('rewire');
const constants = require('../lib/conversation/constants');
const responseFormatter = require('../lib/conversation/response_formatter');
const ConversationSchema = require('../lib/conversation/conversation_schema');
const Conversation = require('../lib/conversation/conversation');
let room = null;
let switchBoard = null;
const userName = 'alice';
let receiverUserId= null;
const expect = chai.expect;

const helper = new Helper('../src/0_bootstrap.js');
const user =  {
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

const dynamic = {
  onCompleteMessage: 'Thanks for reporting this. I\'ll notify @bm immediately.',
  type: "dynamic",
  steps: [
    {
      question: "Start create a user \n [yes]or [no]?",
      answer: {
        type: "choice",
        options: [
          {
            match: "yes"
          },
          {
            match: "no"
          }
        ]
      },
      required: true
    },
    {
      question: "Please enter your user name.",
      answer: {
        type: "text",
        validation:{
          "description": 'full name',
          "type": 'string',
          "minLength": 8
        }
      },
      required: true
    }
  ]
};

const custom = {
  onCompleteMessage: 'Thanks for reporting this. I\'ll notify @bm immediately.',
  type: "custom",
  steps: [
    {
      question: "Start create a user \n [yes]or [no]?",
      answer: {
        type: "choice",
        options: [
          {
            match: "yes"
          },
          {
            match: "no"
          }
        ]
      },
      required: true
    }
  ]
};

const nlu = {
  type: 'nlu',
  properties: {
    name: {
      entityName: 'default 1',
      isObtain: true
    },
    email: {
      entityName: 'default 2',
      isObtain: true
    }
  }
};

let messageText = '@hubot help create user';
const msg = {
  message: {
    user: {
      id: 'myzpof1d13bzmkxqhtjssq3sde',
      name: 'john',
      real_name: ' ',
      email_address: 'john@mf.com',
      mm: '',
      room: '19:ytej8f1ir7rxd@riehf49j1p41c',
      room_name: ''
    },
    text: '@hubot help create user',
    id: 'o66fu186xjnsfedzs7kx8mmkbe',
    done: false,
    room: '19:ytej8f1ir7rxd@riehf49j1p41c'
  },
  match: true,
  envelope: {
    room: '19:ytej8f1ir7rxd@riehf49j1p41c',
    user: {
      id: 'myzpof1d13bzmkxqhtjssq3sde',
      name: 'john',
      real_name: ' ',
      email_address: 'john@mf.com',
      mm: '',
      room: '19:ytej8f1ir7rxd@riehf49j1p41c',
      room_name: ''
    },
    message: {
      user: 'john',
      text: 'help',
      id: 'o66fu186xjnsfedzs7kx8mmkbe',
      done: false,
      room: '19:ytej8f1ir7rxd@riehf49j1p41c'
    }
  },
  reply: (text) => {
    return text
  },
  send:(msg) =>{
    return msg;
  }
};

describe('conversation dialog tests', function() {
  beforeEach(function() {
    room = helper.createRoom();
    room.robot.e.registerIntegration({
      shortDesc: 'conversation dialog tests', name: 'test'});
    room.robot.adapter.UnifiedResponseRenderer =  {
      createMessage(msg) {
        if (typeof msg !== 'string') {
          msg = JSON.stringify(msg);
        }
        return msg;
      }
    };

    switchBoard = room.robot.e.createDialog(room.robot);
    receiverUserId = userName + '&' + room.name;

    const test = function(msg) {
      let conversation = switchBoard.startDialog(msg, 'create user');
      msg.reply("Start create a user \n [yes]or [no]?");
      conversation.addChoice(/no/i, message => message.send('done'));
    };

    const test2 = function(msg) {
      let schema = switchBoard.initSchema('User', dynamic);
      switchBoard.startDialog(msg, 'create user(dynamic)', schema);
    };

    room.robot.e.respond({
        verb: 'create',
        entity: 'user',
        help: 'create user',
        type: 'respond',
        integrationName: 'test'
      },
      test);

    room.robot.e.respond({
        verb: 'dynamic-create',
        entity: 'user',
        type: 'respond',
        help: '<this|#name>- archive specific channel',
        integrationName: 'test'
      },
      test2);
  });

  afterEach(() => room.destroy());

  after(() => switchBoard.conversationManage.cancelConversations(receiverUserId));

  it('register create user', () =>
    room.user.say('alice', '@hubot test create user').then(() => {
      expect(room.messages).to.eql([
        [ 'alice', '@hubot test create user' ],
        [ 'hubot', '@alice Start create a user \n [yes]or [no]?' ]
      ]);
      room.user.say('alice', 'no').then(() => {
        expect(room.messages).to.eql([
          [ 'alice', '@hubot test create user' ],
          [ 'hubot', '@alice Start create a user \n [yes]or [no]?' ],
          [ 'alice', 'no' ]
        ]);
      });
    })
  );
});


describe('conversation manage tests', function() {
  beforeEach(function() {
    room = helper.createRoom();
    room.robot.e.registerIntegration({
      shortDesc: 'conversation manage tests', name: 'test'});
    room.robot.adapter.UnifiedResponseRenderer =  {
      createMessage(msg) {
        return msg;
      }
    };
    receiverUserId = userName + '&' + room.name;
    switchBoard = room.robot.e.createDialog(room.robot);
    const test = function(msg) {
      let conversation = switchBoard.startDialog(msg, 'create user');
      msg.reply("Start create a user \n [yes]or [no]?");
      conversation.addChoice(/yes/i, message => message.reply('done'));
    };

    room.robot.e.respond({
        verb: 'create',
        entity: 'user',
        help: 'create user',
        type: 'respond',
        integrationName: 'test'
      },
      test);
  });


  afterEach(() => room.destroy());

  after(() => switchBoard.conversationManage.cancelConversations(receiverUserId));

  it('add conversation', () =>
    room.user.say(userName, '@hubot test create user').then(() => {
      let result = switchBoard.conversationManage.getCurrentConversation(receiverUserId);
      expect(result.receiverUserId).to.eql(receiverUserId);
    })
  );

  it('get current conversation', function() {
    let result = switchBoard.conversationManage.getCurrentConversation(receiverUserId);
    expect(result.receiverUserId).to.eql(receiverUserId);
  });

  it('show conversation with error id', function() {
    let result = switchBoard.conversationManage.getConversation(receiverUserId, 'error');
    return expect(result).to.contain('Cannot find conversation ID: error');
  });

  it('show conversation with error talk id', function() {
    let current = switchBoard.conversationManage.getCurrentConversation(receiverUserId);
    let result = switchBoard.conversationManage.getConversation('error', current.id);
    expect(result).to.contain('Conversation: `create user` is not created by ID: error.');
  });

  it('show conversation', function() {
    let current = switchBoard.conversationManage.getCurrentConversation(receiverUserId);
    let result = switchBoard.conversationManage.getConversation(receiverUserId, current.id);
    expect(result.id).to.eql(current.id);
  });

  it('show all conversations', () =>
    room.user.say(userName, '@hubot test create user2').then(() => {
      let result = switchBoard.conversationManage.getConversations(receiverUserId);
      expect(result).to.exist.and.be.an('array').and.to.have.length.above(0);
    })
  );

  it('pause conversation with error id', function() {
    let result = switchBoard.conversationManage.pauseConversation(receiverUserId, 'error');
    expect(result).to.contain('Cannot find conversation ID: error');
  });

  it('pause conversation with error talk id', function() {
    let current = switchBoard.conversationManage.getCurrentConversation(receiverUserId);
    let result = switchBoard.conversationManage.pauseConversation('error', current.id);
    expect(result).to.contain('Conversation: `create user` is not created by ID: error.');
  });

  it('pause conversation', function() {
    let current = switchBoard.conversationManage.getCurrentConversation(receiverUserId);
    switchBoard.conversationManage.pauseConversation(receiverUserId, current.id);
    let data = switchBoard.conversationManage.getConversation(receiverUserId, current.id);
    expect(data.status).to.eql('pending');
  });

  it('pause all conversations', function() {
    let result = switchBoard.conversationManage.pauseConversations(receiverUserId);
    expect(result).to.exist.and.be.an('array').and.to.have.length.above(0);
  });

  it('resume conversation with error id', function() {
    let result = switchBoard.conversationManage.resumeConversation(receiverUserId, 'error');
    expect(result).to.contain('Cannot find conversation ID: error');
  });

  it('resume conversation with error talk id', function() {
    let current = switchBoard.conversationManage.getConversations(receiverUserId);
    let result = switchBoard.conversationManage.resumeConversation('error', current[0].id);
    expect(result).to.contain('Conversation: `create user` is not created by ID: error');
  });

  it('resume conversation', function() {
    let current = switchBoard.conversationManage.getConversations(receiverUserId);
    switchBoard.conversationManage.resumeConversation(receiverUserId, current[0].id);
    let data = switchBoard.conversationManage.getConversation(receiverUserId, current[0].id);
    expect(data.status).to.eql('active');
  });

  it('cancel conversation with error id', function() {
    let result = switchBoard.conversationManage.cancelConversation(receiverUserId, 'error');
    expect(result).to.contain('Cannot find conversation ID: error');
  });

  it('cancel conversation with error talk id', function() {
    let current = switchBoard.conversationManage.getCurrentConversation(receiverUserId);
    let result = switchBoard.conversationManage.cancelConversation('error', current.id);
    expect(result).to.contain('Conversation: `create user` is not created by ID: error.');
  });

  it('cancel conversation', function() {
    let current = switchBoard.conversationManage.getCurrentConversation(receiverUserId);
    switchBoard.conversationManage.cancelConversation(receiverUserId, current.id);
    let data = switchBoard.conversationManage.getConversation(receiverUserId, current.id);
    expect(data).to.contain('Cannot find conversation ID');
  });

  it('cancel all conversations', function() {
    let result = switchBoard.conversationManage.cancelConversations(receiverUserId);
    let data = switchBoard.conversationManage.getConversations(receiverUserId);
    expect(result).to.exist;
    expect(data).to.exist.and.be.an('array').and.to.be.empty;
  });
});

describe('conversation schema tests', function() {
  beforeEach(function() {
    room = helper.createRoom();
    room.robot.e.registerIntegration({
      shortDesc: 'conversation manage tests', name: 'test'});
    room.robot.adapter.UnifiedResponseRenderer =  {
      createMessage(msg) {
        return msg;
      }
    };
    receiverUserId = userName + '&' + room.name;
    switchBoard = room.robot.e.createDialog(room.robot);
    const test = function(msg) {
      let schema = switchBoard.initSchema('User', user);
      switchBoard.startDialog(msg, 'create user', schema);
    };

    room.robot.e.respond({
        verb: 'create',
        entity: 'user',
        help: 'create user',
        type: 'respond',
        integrationName: 'test'
      },
      test);

    const test2 = function(msg) {
      let schema = switchBoard.initSchema('User', dynamic);
      switchBoard.startDialog(msg, 'dynamic-create user', schema);
    };


    room.robot.e.respond({
        verb: 'dynamic-create',
        entity: 'user',
        help: 'dynamic-create user',
        type: 'respond',
        integrationName: 'test'
      },
      test2);
  });

  afterEach(() => room.destroy());

  after(() => switchBoard.conversationManage.cancelConversations(receiverUserId));

  it('init conversation user schema', function() {
    let conversationSchema = new ConversationSchema(room.robot, 'create user', user);
    conversationSchema.init();
    expect(conversationSchema.name).to.eql('create user');
    expect(conversationSchema.steps.length).to.eql(1);
    expect(conversationSchema.steps[0]).to.include.keys('question', 'answer');
  });

  it('init conversation dynamic schema', function() {
    let conversationSchema = new ConversationSchema(room.robot, 'create user', dynamic);
    conversationSchema.init();
    expect(conversationSchema.name).to.eql('create user');
    expect(conversationSchema.steps.length).to.eql(2);
  });

  it('validate conversation dynamic schema', function() {
    let conversationSchema = new ConversationSchema(room.robot, 'create user', dynamic);
    conversationSchema.init();
    expect(conversationSchema.name).to.eql('create user');
    expect(conversationSchema.steps.length).to.eql(2);
    let result = conversationSchema.validate(4564, conversationSchema.steps[1].answer.validation);
    let result2 = conversationSchema.validate('qi', conversationSchema.steps[1].answer.validation);
    let result3 = conversationSchema.validate('shipengqi', conversationSchema.steps[1].answer.validation);
    expect(result.status).to.eql(false);
    expect(result2.status).to.eql(false);
    expect(result3.status).to.eql(true);
  });
});

describe('conversation schema tests', function() {
  beforeEach(function() {
    room = helper.createRoom();
    room.robot.e.registerIntegration({
      shortDesc: 'conversation manage tests', name: 'test'});
    room.robot.adapter.UnifiedResponseRenderer =  {
      createMessage(msg) {
        return msg;
      }
    };
    receiverUserId = userName + '&' + room.name;
    switchBoard = room.robot.e.createDialog(room.robot);
    const test = function(msg) {
      let schema = switchBoard.initSchema('User', user);
      switchBoard.startDialog(msg, 'create user', schema);
    };

    room.robot.e.respond({
        verb: 'create',
        entity: 'user',
        help: 'create user',
        type: 'respond',
        integrationName: 'test'
      },
      test);

    const test2 = function(msg) {
      let schema = switchBoard.initSchema('User', dynamic);
      switchBoard.startDialog(msg, 'dynamic-create user', schema);
    };


    room.robot.e.respond({
        verb: 'dynamic-create',
        entity: 'user',
        help: 'dynamic-create user',
        type: 'respond',
        integrationName: 'test'
      },
      test2);
  });

  afterEach(() => room.destroy());

  after(() => switchBoard.conversationManage.cancelConversations(receiverUserId));

  it('init conversation user schema', function() {
    let conversationSchema = new ConversationSchema(room.robot, 'create user', user);
    conversationSchema.init();
    expect(conversationSchema.name).to.eql('create user');
    expect(conversationSchema.steps.length).to.eql(1);
    expect(conversationSchema.steps[0]).to.include.keys('question', 'answer');
  });

  it('init conversation dynamic schema', function() {
    let conversationSchema = new ConversationSchema(room.robot, 'create user', dynamic);
    conversationSchema.init();
    expect(conversationSchema.name).to.eql('create user');
    expect(conversationSchema.steps.length).to.eql(2);
  });

  it('init conversation custom schema', function() {
    let conversationSchema = new ConversationSchema(room.robot, 'create user', custom);
    conversationSchema.init();
    expect(conversationSchema.name).to.eql('create user');
    expect(conversationSchema.steps.length).to.eql(1);
  });

  it('init conversation nlu schema', function() {
    let conversationSchema = new ConversationSchema(room.robot, 'create user', nlu);
    conversationSchema.init();
    expect(conversationSchema.name).to.eql('create user');
    console.dir(conversationSchema.steps);
    expect(conversationSchema.steps.length).to.eql(2);
  });

  it('validate conversation dynamic schema', function() {
    let conversationSchema = new ConversationSchema(room.robot, 'create user', dynamic);
    conversationSchema.init();
    expect(conversationSchema.name).to.eql('create user');
    expect(conversationSchema.steps.length).to.eql(2);
    let result = conversationSchema.validate(4564, conversationSchema.steps[1].answer.validation);
    let result2 = conversationSchema.validate('qi', conversationSchema.steps[1].answer.validation);
    let result3 = conversationSchema.validate('shipengqi', conversationSchema.steps[1].answer.validation);
    expect(result.status).to.eql(false);
    expect(result2.status).to.eql(false);
    expect(result3.status).to.eql(true);
  });
});

describe('conversation constants tests', function() {

  it('should have CONVERSATION_STATUS', function() {
    const CONVERSATION_STATUS = {
      ACTIVE: 'active',
      PAUSED: 'pending'
    };

    expect(constants.CONVERSATION_STATUS).to.exist.and.deep.equal(CONVERSATION_STATUS);
  });

  it('should have ADAPTER_PATH_MAPPINGS', function() {
    const CONVERSATION_SCHEMA_TYPE = {
      DYNAMIC: 'dynamic',
      JSON_SCHEMA: 'object',
      CUSTOM: 'custom',
      NLU: 'nlu'
    };


    expect(constants.CONVERSATION_SCHEMA_TYPE).to.exist.and.deep.equal(CONVERSATION_SCHEMA_TYPE);
  });

  it('should have ADAPTER_PATH_MAPPINGS', function() {
    const DEFAULT_EXPIRE_TIME = 60 * 60 * 1000;

    expect(constants.DEFAULT_EXPIRE_TIME).to.exist.and.deep.equal(DEFAULT_EXPIRE_TIME);
  });
});

describe('conversation response formatter tests', function() {
  beforeEach(function() {
    room = helper.createRoom();
    return room.robot.adapter.UnifiedResponseRenderer =  {
      createMessage(msg) {
        return msg;
      }
    };});

  afterEach(() => room.destroy());

  it('should create waring string response', function() {
    let resp = responseFormatter.createWarning(room.robot, 'test string');
    expect(resp).to.exist.and.deep.equal({"parts":[{"text":"test string","title": "","color":"#daa038","fields":[]}]});
  });

  it('should create success string response', function() {
    let resp = responseFormatter.createSuccess(room.robot, 'test string');
    expect(resp).to.exist.and.deep.equal({"parts":[{"text":"test string","title": "","color":"#36a64f","fields":[]}]});
  });

  it('should create error string response', function() {
    let resp = responseFormatter.createError(room.robot, 'test string');
    expect(resp).to.exist.and.deep.equal({"parts":[{"text":"test string","title": "","color":"#d00000","fields":[]}]});
  });

  it('should create error object response', function() {
    let resp = responseFormatter.createError(room.robot, new Error('test string'));
    expect(resp).to.exist.and.deep.equal({"parts":[{"text":"test string","title": "","color":"#d00000","fields":[]}]});
  });

  it('should create success array response', function() {
    let resp = responseFormatter.createSuccess(room.robot, [{title:'test',value:'text'}]);
    expect(resp).to.exist.and.deep.equal({"parts":[{"text":"","title": "Conversation count: 1","color":"#36a64f","fields":[{"title":"ID: undefined","value":"**Name:** undefined \n**Status:** undefined"}]}]});
  });

  it('should create success object response', function() {
    let resp = responseFormatter.createSuccess(room.robot, {title:'test',value:'text'});
    expect(resp).to.exist.and.deep.equal({"parts":[{"text":"","title": "","color":"#36a64f","fields":[{"title":"title","value":"test"},{"title":"value","value":"text"},{"title":"allAnswers","value":"Cannot find any response"}]}]});
  });

  it('should create success object response', function() {
    let resp = responseFormatter.createSuccess(room.robot, {title:'test',value:'text', allAnswers: ['test']});
    expect(resp).to.exist.and.deep.equal({"parts":[{"text":"","title": "","color":"#36a64f","fields":[{"title":"title","value":"test"},{"title":"value","value":"text"},{"title":"allAnswers","value":"(1) test \n"}]}]});
  });
});

describe('conversation operation tests', () => {
  let conversation, conversationSchema;
  let expireTime = 60 * 60 * 1000;
  let conversationName = 'userCreation';
  let integrationName = 'integrationOne';
  let hubotAdapterSaved = null;
  before(() => {
    hubotAdapterSaved = process.env.HUBOT_ADAPTER;
    delete process.env.HUBOT_ADAPTER;
    room = helper.createRoom();
    room.robot.adapter.UnifiedResponseRenderer = {
      createMessage(msg) {
        return msg;
      }
    };
    conversationSchema = new ConversationSchema(room.robot, 'create user', dynamic);
    conversationSchema.init();
    receiverUserId = userName + '&' + room.name;
    conversation = new Conversation(room.robot, msg, receiverUserId, conversationName, conversationSchema, integrationName, expireTime);
  });
  after(() => {
    process.env.HUBOT_ADAPTER = hubotAdapterSaved;
    room.destroy()
  });

  it('should resume a conversation', () => {
    conversation.resume();
    expect(conversation.status).to.equal('active');
  });

  it('should pause a conversation', () => {
    conversation.pause();
    expect(conversation.status).to.equal('pending');
    expect(conversation.pauseTime).to.not.be.null;
  });

  it('should clear the choices array', () => {
    conversation._reSetChoice();
    expect(conversation.choices).to.be.an('array').that.is.empty;
  });

  it('should reset the conversation expire time', (done) => {
    conversation._reSetConversationExpireTime();
    expect(conversation.expiration).to.not.be.null;
    done();
  });

  it('should register a new choice', (done) => {
    conversation.addChoice(/yes/i, message => message.reply('done'));
    expect(conversation.expiration).to.not.be.null;
    done();
  });

  it('should clear the timer if a choice is made', (done) => {
    let msg = 'handle choice';
    let text = 'yes';
    let choiceHandlerCalled = false;
    const handler = (msg) => {
      choiceHandlerCalled = true;
      return msg;
    };
    conversation._reSetChoice();
    conversation.addChoice(/yes/i, handler);
    conversation.executeChoicesHandler(msg, text);
    expect(conversation.expiration).to.not.be.null;
    expect(choiceHandlerCalled).to.be.true;
    expect(conversation.choices).to.be.an('array').that.is.not.empty;
    done();
  });

  it('should clear the timer if a choice is made - message text not match the regex', (done) => {
    let msg = 'handle choice';
    let text = 'no';
    let choiceHandlerCalled = false;
    const handler = (msg) => {
      choiceHandlerCalled = true;
      return msg;
    };
    conversation._reSetChoice();
    conversation.addChoice(/yes/i, handler);
    conversation.executeChoicesHandler(msg, text);
    expect(conversation.expiration).to.not.be.null;
    expect(choiceHandlerCalled).to.be.false;
    expect(conversation.choices).to.be.an('array').that.is.not.empty;
    done();
  });

  it('should receive an incoming message', (done) => {
    let choiceHandlerCalled = false;
    const handler = (msg) => {
      choiceHandlerCalled = true;
      return msg;
    };
    conversation._reSetChoice();
    conversation.addChoice(/yes/i, handler);
    conversation.receiveMessage(msg);
    expect(conversation.expiration).to.not.be.null;
    expect(choiceHandlerCalled).to.be.false;
    expect(conversation.choices).to.be.an('array').that.is.not.empty;
    done();
  });

  it('should strip the bot name from description text', () => {
    let res = conversation._stripBotName(msg.message.text);
    expect(res).to.equal('help create user');
  });

  it('should return the proper regexp - input is regexp', () => {
    const conversationRewire = rewire('../lib/conversation/conversation');
    const toRegExpRewire = conversationRewire.__get__('toRegExp');
    let res = toRegExpRewire(/\bskip\b$/i);
    expect(res).to.deep.equal(/\bskip\b$/i);
  });

  it('should return the proper regexp - input is string', () => {
    const conversationRewire = rewire('../lib/conversation/conversation');
    const toRegExpRewire = conversationRewire.__get__('toRegExp');
    let res = toRegExpRewire('skip');
    expect(res).to.deep.equal(new RegExp('skip'));
  });

  it('should update the last question', () => {
    let ques = 'question one';
    conversation.updateQuestion(ques);
    expect(conversation.lastQuestion).to.equal(ques);
  });

  it('should update all answers', () => {
    let key = 'answerKey';
    let value = 'answerVal';
    conversation.updateAnswers(value, key);
    expect(conversation.allAnswers).to.deep.include({'answerKey':'answerVal'});
  });

  it('should update all answers - without key', () => {
    let value = 'answerVal';
    conversation.updateAnswers(value);
    expect(conversation.allAnswers).to.be.an('array').that.is.not.empty;
  });

  it('should validate the input value - validation schema is not object', () => {
    let step = {
      question: "Please enter your user name.",
      entityName:'createUser',
      answer: {
        type: "text",
        validation: 'validation'
      },
      required: true
    };
    let doneCalled = false;
    const mockDone = () => {
      doneCalled = true;
      return true;
    };
    conversation.validateInput(step, 'test', mockDone);
    expect(doneCalled).to.be.true;
  });

  it('should validate the input value - validation status is false', () => {
    let step = {
      question: "Please enter your user name.",
      entityName:'createUser',
      answer: {
        type: "text",
        validation: {
          "description": 'full name',
          "type": 'string',
          "minLength": 8
        }
      },
      required: true
    };
    let doneCalled = false;
    const mockDone = () => {
      doneCalled = true;
      return true;
    };
    conversation.validateInput(step, 'test', mockDone);
    expect(doneCalled).to.be.false;
  });

  it('should validate the input value - validation status is true', () => {
    let step = {
      question: "Please enter your user name.",
      entityName:'createUser',
      answer: {
        type: "text",
        validation: {
          "description": 'full name',
          "type": 'string',
          "minLength": 8
        }
      },
      required: true
    };
    let doneCalled = false;
    const mockDone = () => {
      doneCalled = true;
      return true;
    };
    conversation.validateInput(step, 'this is test', mockDone);
    expect(doneCalled).to.be.true;
  });

  it('should parse value to number', () => {
    expect(conversation._isNumber('1234')).to.equal(1234);
    expect(conversation._isNumber('test')).to.equal('test');
  });

  it('should parse the message', () => {
    expect(conversation._parseMessage(msg.message.text)).to.equal('help create user');
  });

  it('should parse the message - get the transformed text', () => {
    let testInput = '1234';
    expect(conversation._parseMessage(testInput)).to.equal(1234);
  });

  it('should add question - question is an object', () => {
    let step = {
      question: "Please enter your user name.",
      entityName:'createUser',
      answer: {
        type: "text",
        validation: {
          "description": 'full name',
          "type": 'string',
          "minLength": 8
        }
      },
      required: true
    };
    msg.message.text = 'attr1:val1,attr2:val2,attr3:val3';
    let doneCalled = false;
    const mockDone = () => {
      doneCalled = true;
      return true;
    };
    conversation._reSetChoice();
    conversation.allAnswers = [];
    conversation.addObjectQuestion(step, mockDone);
    expect(conversation.choices).to.be.an('array').that.is.not.empty;
    conversation.executeChoicesHandler(msg, 'test');
    expect(conversation.allAnswers).to.be.an('array').that.is.not.empty;
    msg.message.text = messageText;
  });

  it('should add question - question is an object - get parse err', () => {
    let step = {
      question: "Please enter your user name.",
      entityName:'createUser',
      answer: {
        type: "text",
        validation: {
          "description": 'full name',
          "type": 'string',
          "minLength": 8
        }
      },
      required: true
    };
    let doneCalled = false;
    const mockDone = () => {
      doneCalled = true;
      return true;
    };
    conversation._reSetChoice();
    conversation.allAnswers = [];
    conversation.addObjectQuestion(step, mockDone);
    expect(conversation.choices).to.be.an('array').that.is.not.empty;
    conversation.executeChoicesHandler(msg, 'test');
    expect(conversation.allAnswers).to.be.an('array').that.is.empty;
  });

  it('should add question - question is text', () => {
    let step = {
      question: "Please enter your user name.",
      entityName:'createUser',
      answer: {
        type: "text",
        validation: {
          "description": 'full name',
          "type": 'string',
          "minLength": 8
        }
      },
      required: true
    };
    let doneCalled = false;
    const mockDone = () => {
      doneCalled = true;
      return true;
    };
    conversation._reSetChoice();
    conversation.allAnswers = [];
    conversation.addTextQuestion(step, mockDone);
    expect(conversation.choices).to.be.an('array').that.is.not.empty;
    conversation.executeChoicesHandler(msg, 'test question ?');
    expect(conversation.allAnswers).to.be.an('array').that.is.not.empty;
  });

  it('should add choice question', () => {
    let step = {
      question: "Start create a user [yes] or [no]?",
      answer: {
        type: "choice",
        default:'default answer',
        options: [
          {
            match: "option"
          }
        ]
      },
      required: true
    };
    let doneCalled = false;
    const mockDone = () => {
      doneCalled = true;
      return true;
    };
    conversation._reSetChoice();
    conversation.allAnswers = [];
    conversation.addChoiceQuestion(step, mockDone);
    expect(conversation.choices).to.be.an('array').that.is.not.empty;
    conversation.executeChoicesHandler(msg, 'option');
    expect(conversation.allAnswers).to.be.an('array').that.is.not.empty;
  });

  it('should add skip keyword', () => {
    let step = {
      question: "Please enter your user name.",
      entityName:'createUser',
      answer: {
        type: "text",
        default:'default answer',
        validation: {
          "description": 'full name',
          "type": 'string',
          "minLength": 8
        }
      },
      required: false
    };
    let doneCalled = false;
    const mockDone = () => {
      doneCalled = true;
      return true;
    };
    conversation._reSetChoice();
    conversation.allAnswers = [];
    conversation.addSkip(step, mockDone);
    expect(conversation.choices).to.be.an('array').that.is.not.empty;
    conversation.executeChoicesHandler(msg, 'skip');
    expect(conversation.choices).to.be.an('array').that.is.empty;
    expect(conversation.allAnswers).to.be.an('array').that.is.empty;
  });

  /*it('should start the conversation', () => {
    conversation.start(msg);
  });*/

  it('should invoke a dialog message - answer type is text', () => {
    let step = {
      question: "Please enter your user name.",
      entityName:'createUser',
      answer: {
        type: "text",
        validation: {
          "description": 'full name',
          "type": 'string',
          "minLength": 8
        }
      },
      required: false
    };
    let doneCalled = false;
    const mockDone = () => {
      doneCalled = true;
      return true;
    };
    conversation._invokeDialog(msg, step, mockDone);
    expect(conversation.expiration).to.not.be.null;
  });

  it('should invoke a dialog message - answer type is choice', () => {
    let step = {
      question: "Please enter your user name.",
      entityName:'createUser',
      answer: {
        type: "choice",
        validation: {
          "description": 'full name',
          "type": 'string',
          "minLength": 8
        }
      },
      required: false
    };
    let doneCalled = false;
    const mockDone = () => {
      doneCalled = true;
      return true;
    };
    conversation._invokeDialog(msg, step, mockDone);
    expect(conversation.expiration).to.not.be.null;
  });

  it('should invoke a dialog message - answer type is object', () => {
    let step = {
      question: "Please enter your user name.",
      entityName:'createUser',
      answer: {
        type: "object",
        validation: {
          "description": 'full name',
          "type": 'string',
          "minLength": 8
        }
      },
      required: false
    };
    let doneCalled = false;
    const mockDone = () => {
      doneCalled = true;
      return true;
    };
    conversation._invokeDialog(msg, step, mockDone);
    expect(conversation.expiration).to.not.be.null;
  });

  it('should invoke a dialog with visual command - answer type is choice and platform is slack', () => {
    process.env.HUBOT_ADAPTER = 'slack';
    let step = {
      question: "Start create a user [yes] or [no]?",
      answer: {
        type: "choice",
        default:'default answer',
        options: [
          {
            match: "yes"
          },
          {
            match: "no"
          }
        ]
      },
      required: true
    };
    let interactiveMsg = 'interactive message created';
    room.robot.adapter.UnifiedResponseRenderer.createInteractiveMessage = () => {
      return interactiveMsg;
    };
    let doneCalled = false;
    const mockDone = () => {
      doneCalled = true;
      return true;
    };
    conversation._invokeDialogWithVisualCommand(msg, step, mockDone);
    expect(conversation.lastQuestion).to.equal(step.question);
  });

  it('should invoke a dialog with visual command - answer type is choice and platform is not slack', () => {
    process.env.HUBOT_ADAPTER = 'mattermost';
    let step = {
      question: "Start create a user [yes] or [no]?",
      answer: {
        type: "choice",
        default:'default answer',
        options: [
          {
            match: "yes"
          },
          {
            match: "no"
          }
        ]
      },
      required: true
    };
    let interactiveMsg = 'interactive message created';
    room.robot.adapter.UnifiedResponseRenderer.createInteractiveMessage = () => {
      return interactiveMsg;
    };
    let doneCalled = false;
    const mockDone = () => {
      doneCalled = true;
      return true;
    };
    conversation._invokeDialogWithVisualCommand(msg, step, mockDone);
    expect(conversation.lastQuestion).to.equal(step.question);
  });

  it('should invoke a dialog with visual command - answer type is choice and platform is not slack', () => {
    process.env.HUBOT_ADAPTER = 'mattermost';
    let step = {
      question: "Start create a user [yes] or [no]?",
      answer: {
        type: "choice",
        default:'default answer',
        options: [
          {
            match: "option 1"
          },
          {
            match: "option 2"
          },
          {
            match: "option 3"
          },
          {
            match: "option 4"
          },
          {
            match: "option 5"
          },
          {
            match: "option 6"
          }
        ]
      },
      required: true
    };
    let interactiveMsg = 'interactive message created';
    room.robot.adapter.UnifiedResponseRenderer.createInteractiveMessage = () => {
      return interactiveMsg;
    };
    let doneCalled = false;
    const mockDone = () => {
      doneCalled = true;
      return true;
    };
    conversation.expiration = null;
    conversation._invokeDialogWithVisualCommand(msg, step, mockDone);
    let expectRes = 'Start create a user [yes] or [no]? (Choices are *`option 1,option 2,option 3,option 4,option 5,opt' +
      'ion 6`*)\n(Default is default answer, type [skip] to continue)';
    expect(conversation.lastQuestion).to.equal(expectRes);
    expect(conversation.expiration).to.not.be.null;
  });

  it('should invoke a dialog with visual command - answer type is text', () => {
    process.env.HUBOT_ADAPTER = 'slack';
    let step = {
      question: "Start create a user [yes] or [no]?",
      answer: {
        type: "choice",
        default:'default answer',
        options: [
          {
            match: "option 1"
          },
          {
            match: "option 2"
          }
        ]
      },
      required: false
    };
    let interactiveMsg = 'interactive message created';
    room.robot.adapter.UnifiedResponseRenderer.createInteractiveMessage = () => {
      return interactiveMsg;
    };
    let doneCalled = false;
    const mockDone = () => {
      doneCalled = true;
      return true;
    };
    conversation._invokeDialogWithVisualCommand(msg, step, mockDone);
    expect(conversation.lastQuestion).to.equal(step.question);
  });
});


