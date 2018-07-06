## Conversation Manage Example
```javascript
const {initManager} = require('sbot-conversation');

module.exports = function(robot) {
  let switchBoard = initManager(robot);
  const tryToGetConversation = function(msg) {
    let existsConversation = switchBoard.existsConversation(msg.message);
    if (!existsConversation) {
      return msg.send(`@${msg.message.user.name} There is no active conversation.`);
    }
    let id = msg.match[1];
    let receiverUserId = switchBoard.getId(msg.message);
    if (id) {
      id = id.toLowerCase();
    } else {
      let current = switchBoard.getCurrentConversation(receiverUserId);
      id = current.id;
    }

    return {
      receiverUserId,
      id
    };
  };

  const showConversation = function(msg) {
    let response;
    let ids = tryToGetConversation(msg);
    if (!ids) {
      return;
    }
    let receiverUserId = ids.receiverUserId;
    let id = ids.id;
    if (id === 'all') {
      response = switchBoard.getConversations(receiverUserId);
    } else {
      response = switchBoard.getConversation(receiverUserId, id);
    }
    msg.send(response);
  };

  const cancelConversation = function(msg) {
    let response;
    let ids = tryToGetConversation(msg);
    if (!ids) {
      return;
    }
    let receiverUserId = ids.receiverUserId;
    let id = ids.id;
    if (id === 'all') {
      response = switchBoard.cancelConversations(receiverUserId);
    } else {
      response = switchBoard.cancelConversation(receiverUserId, id);
    }
    msg.send(response);
  };

  const resumeConversation = function(msg) {
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

  robot.respond(/show conversation.*/i, showConversation);

  robot.respond(/cancel conversation.*/i, cancelConversation);

  robot.respond(/resume conversation.*/i, resumeConversation);
};
```