const _ = require('lodash');
const Dialog = require('./dialog');
const constants = require('./constants');

function initManager(robot, type = 'user', customListener) {
  if (!_.isFunction(customListener)) {
    customListener = () => true;
  }
  let dialog = new Dialog(robot);

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
