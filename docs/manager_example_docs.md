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
    let reg = /(@hubot )?(show conversation|cancel conversation|resume conversation)(.*)/i;
    let id = msg.message.text.match(reg)[3];
    let receiverUserId = switchBoard.getId(msg.message);
    if (id) {
      id = id.toLowerCase().trim();
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
      response = switchBoard.getConversation(receiverUserId, Number(id));
    }
    msg.send(response);
  };

  const cancelConversation = function(msg) {
    let ids = tryToGetConversation(msg);
    if (!ids) {
      return;
    }
    let receiverUserId = ids.receiverUserId;
    let id = ids.id;
    if (id === 'all') {
      switchBoard.cancelConversations(receiverUserId);
    } else {
      switchBoard.cancelConversation(receiverUserId, Number(id));
    }
    msg.send('cancel conversation successfully');
  };

  const resumeConversation = function(msg) {
    let ids = tryToGetConversation(msg);
    if (!ids) {
      return;
    }
    let receiverUserId = ids.receiverUserId;
    let id = ids.id;
    let resumedConversation = switchBoard.resumeConversation(receiverUserId, Number(id));
    console.log(resumedConversation.name);
    msg.send('resume conversation successfully');
  };

  robot.respond(/show conversation.*/i, showConversation);

  robot.respond(/cancel conversation.*/i, cancelConversation);

  robot.respond(/resume conversation.*/i, resumeConversation);
};
```