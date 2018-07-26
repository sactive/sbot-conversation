const _ = require('lodash');
const Dialog = require('./dialog');
const constants = require('./constants');

function getInstance(robot, type, singleton) {
  if (singleton) {
    return getSingle(robot, type);
  }
  return createInstance(robot, type);
}

function getSingle(robot, type) {
  if (!getSingle.instance) {
    getSingle.instance = createInstance(robot, type);
  }
  return getSingle.instance;
}

function createInstance(robot, type) {
  return new Dialog(robot, type);
}

function initManager(robot, type = 'user', customListener, singleton = true) {
  if (!_.isFunction(customListener)) {
    customListener = () => true;
  }
  let dialog = getInstance(robot, type, singleton);
  let matcher = function(msg) {
    let isExists = dialog.existsConversation(msg);
    return (customListener(msg)) ? isExists : false;
  };

  let handler = function(msg) {
    let receiverUserId = dialog.getId(msg.message);
    let conversation = dialog.getCurrentConversation(receiverUserId);
    conversation.receiveMessage(msg);
  };
  robot.listen(
    matcher,
    handler
  );

  return dialog;
}

module.exports = {
  initManager,
  Dialog: Dialog,
  private: {
    constants: constants
  }
};
