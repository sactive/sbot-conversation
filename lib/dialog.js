const ConversationSchema = require('./conversation_schema');
const ConversationManager = require('./conversation_manager');
const Conversation = require('./conversation');

/**
 * Create a new `Dialog`.
 * Inherits from ConversationManager.
 * @class
 * @public
 * @extends ConversationManager
 */
class Dialog extends ConversationManager {
  /**
   * Init conversation schema.
   * @public
   * @param {String} name - schema name.
   * @param {Object} schema - schema object.
   * @returns {ConversationSchema} Returns a ConversationSchema instance.
   */
  initSchema(name, schema) {
    let conversationSchema = new ConversationSchema(this.robot, name, schema);
    conversationSchema.init();
    return conversationSchema;
  }

  /**
   * Start a dialog.
   * @public
   * @param {Object} msg - the current response.
   * @param {String} conversationName - conversation name.
   * @param {Object} schema - schema object.
   * @param {Number} expireTime - expire time.
   * @returns {Conversation} Returns a Conversation instance.
   */
  start(msg, conversationName, schema, expireTime) {
    let receiverUserId = this.getId(msg.message);
    let conversation = new Conversation(this.robot, msg, receiverUserId, conversationName, schema, expireTime);
    this.addConversation(conversation);
    conversation.start(msg);
    return conversation;
  }
}

module.exports = Dialog;
