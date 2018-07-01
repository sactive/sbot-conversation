const Dialog = require('./dialog');

module.exports = function conversationMiddleware(context, next, done) {
  let msg = context.response;
  let robot = msg.robot;

  robot.logger.debug('Conversation middleware processing: ', msg.message.text);

  let dialog = new Dialog(robot);
  let existsConversation = dialog.existsConversation(msg.message);
  if (existsConversation) {
    robot.processStatus.isConversation = true;
    let receiverUserId = dialog.getId(msg.message);
    let conversation = dialog.getCurrentConversation(receiverUserId);
    conversation.receiveMessage(msg);
  }
  return next();
};