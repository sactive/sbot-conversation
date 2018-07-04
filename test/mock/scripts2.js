const {DYNAMIC_SCHEMA_MOCK, JSON_SCHEMA_MOCK} = require('./schemas');
const {initManager} = require('../..');


module.exports = function (robot) {
  let switchBoard = initManager(robot);
  robot.respond(/dynamic create user/i, function (msg) {
    let schema = switchBoard.initSchema('User', DYNAMIC_SCHEMA_MOCK);
    switchBoard.start(msg, 'dynamic create user', schema);
  });

  robot.respond(/create user/i, function (msg) {
    let schema = switchBoard.initSchema('User', JSON_SCHEMA_MOCK);
    switchBoard.start(msg, 'create user', schema);
  });

  const tryToGetConversation = function(msg) {
    let existsConversation = switchBoard.existsConversation(msg.message);
    if (!existsConversation) {
      return msg.send('There is no active conversation.');
    }
    let id = msg.match[1];
    console.log('--------------------')
    console.log(msg.match)
    let receiverUserId = switchBoard.getId(msg.message);
    if(id) {
      id = id.toLowerCase();
    }else {
      let current = switchBoard.getCurrentConversation(receiverUserId);
      id = current.id;
    }

    return {
      receiverUserId,
      id
    };
  };

  const showConversation = function (msg) {
    let response;
    let ids = tryToGetConversation(msg);
    if (!ids) {
      return;
    }
    let receiverUserId = ids.receiverUserId;
    let id = ids.id;
    if(id === 'all') {
      response = switchBoard.getConversations(receiverUserId);
    }else {
      response = switchBoard.getConversation(receiverUserId, id);
    }
    msg.send(createSuccess(robot, response, msg));
  };

  const cancelConversation = function (msg) {
    let response;
    let ids = tryToGetConversation(msg);
    if (!ids) {
      return;
    }
    let receiverUserId = ids.receiverUserId;
    let id = ids.id;
    if(id === 'all') {
      response = switchBoard.cancelConversations(receiverUserId);
    }else {
      response = switchBoard.cancelConversation(receiverUserId, id);
    }
    msg.send(response);
  };

  const resumeConversation = function (msg) {
    let response;
    let ids = tryToGetConversation(msg);
    if (!ids) {
      return;
    }
    let receiverUserId = ids.receiverUserId;
    let id = ids.id;
    response = switchBoard.resumeConversation(receiverUserId, id);
    msg.send(response);
  };

  robot.respond(/show conversation.*/i, function (msg) {
    let schema = switchBoard.initSchema('User', JSON_SCHEMA_MOCK);
    switchBoard.start(msg, 'create user', schema);
  });

  robot.respond(/cancel conversation.*/i, function (msg) {
    let schema = switchBoard.initSchema('User', JSON_SCHEMA_MOCK);
    switchBoard.start(msg, 'create user', schema);
  });

  robot.respond(/resume conversation.*/i, function (msg) {
    let schema = switchBoard.initSchema('User', JSON_SCHEMA_MOCK);
    switchBoard.start(msg, 'create user', schema);
  });
};