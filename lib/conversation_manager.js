const extend = require('extend');
const {CONVERSATION_STATUS} = require('./constants');
const {createResponse} = require('./unified_formatter');

/**
 * Create a new `ConversationManager`.
 * @class
 * @private
 */

class ConversationManager {
  /**
   * @constructs ConversationManager
   * @param {hubot.Robot} robot - instance of hubot's `Robot`.
   * @param {String} type - type for conversation manage.
   */
  constructor(robot, type = 'user') {
    this.robot = robot;
    this.type = type;
    this.conversationMappings = new Map();
  }

  /**
   * Create a new conversation.
   * @private
   * @param {Conversation} conversation - a new conversation.
   * @returns {Conversation} Returns the conversation instance.
   */
  addConversation(conversation) {
    let receiverUserId = conversation.receiverUserId;
    let options = {
      single: true
    };
    this.pauseConversations(receiverUserId);
    this.robot.logger.info(`Create a new conversation: ${conversation.id}, name: ${conversation.name}`);
    this.conversationMappings.set(conversation.id, conversation);

    conversation.on('end', final => {
      this.robot.logger.info(`Conversation: ${conversation.id} end`);
      this.robot.logger.debug(final);
      this.cancelConversation(receiverUserId, conversation.id, options);
    });

    conversation.on('expired', () => {
      this.robot.logger.info(`Conversation: ${conversation.id} is expired`);
      this.cancelConversation(receiverUserId, conversation.id, options);
    });

    conversation.on('close', () => {
      this.robot.logger.info(`Conversation: ${conversation.id} is closed`);
      this.cancelConversation(receiverUserId, conversation.id, options);
    });

    return conversation;
  }

  /**
   * Resume a conversation of `receiverUserId`.
   * @param {String} receiverUserId - `userId&roomId` or roomId.
   * @param {String} conversationId - conversation id.
   * @returns {Object|Conversation} Returns result of the resume operation or the resumed conversation.
   */
  resumeConversation(receiverUserId, conversationId) {
    let conversation = this.conversationMappings.get(conversationId);
    if (!conversation) {
      return createResponse(new Error(`Cannot find conversation: ${conversationId}.`));
    }
    let conversationName = conversation.name;
    this.robot.logger.debug(`Resume conversation: ${conversationId}, name: ${conversationName}`);
    if (!this._verifyPermission(receiverUserId, conversationId)) {
      return createResponse(new Error(`Conversation: ${conversationId} is not created by user id: ${receiverUserId}.`));
    }
    this.pauseConversations(receiverUserId);
    this.conversationMappings.get(conversationId).resume();
    return {
      id: conversation.id,
      name: conversationName,
      status: conversation.status,
      startTime: conversation.startTime,
      allAnswers: conversation.allAnswers,
      lastQuestion: conversation.lastQuestion,
      lastReply: conversation.lastReply
    };
  }

  /**
   * Pause a conversation.
   * @private
   * @param {String} receiverUserId - `userId&roomId` or roomId.
   * @param {String} conversationId - conversation id.
   * @returns {String} Returns pause conversation message.
   */
  pauseConversation(receiverUserId, conversationId) {
    let conversation = this.conversationMappings.get(conversationId);
    if (!conversation) {
      return `Cannot find conversation: ${conversationId}.`;
    }
    let conversationName = conversation.name;
    this.robot.logger.debug(`Pause conversation: ${conversationId}, name: ${conversationName}`);
    if (!this._verifyPermission(receiverUserId, conversationId)) {
      return `Conversation: \`${conversationName}\` is not created by user id: ${receiverUserId}.`;
    }
    if (conversation.status === CONVERSATION_STATUS.PAUSED) {
      return `Conversation: \`${conversationName}\` has already be paused.`;
    }
    this.conversationMappings.get(conversationId).pause();
  }

  /**
   * Pause all conversations.
   * @private
   * @param {String} receiverUserId - `userId&roomId` or roomId.
   * @returns {Array.<String>} Returns all paused conversations messages.
   */
  pauseConversations(receiverUserId) {
    this.robot.logger.debug(`Pause all conversations of user id: ${receiverUserId}`);
    let results = [];
    for (let [id, conversation] of this.conversationMappings.entries()) {
      if (conversation.receiverUserId === receiverUserId) {
        results.push(this.pauseConversation(receiverUserId, id));
      }
    }
    return results;
  }

  /**
   * Get all conversations of `receiverUserId`.
   * @param {String} receiverUserId - `userId&roomId` or roomId.
   * @returns {Array.<Conversation>} Returns all conversations of `receiverUserId`.
   */
  getConversations(receiverUserId) {
    this.robot.logger.debug(`Show all conversations of user id: ${receiverUserId}`);
    let results = [];
    for (let [id, conversation] of this.conversationMappings.entries()) {
      if (conversation.receiverUserId === receiverUserId) {
        let result = this.getConversation(receiverUserId, id);
        results.push(result);
      }
    }
    return results;
  }

  /**
   * Get a conversation of `receiverUserId`.
   * @param {String} receiverUserId - `userId&roomId` or roomId.
   * @param {String} conversationId - conversation id.
   * @returns {Conversation} Returns the conversation.
   */
  getConversation(receiverUserId, conversationId) {
    let conversation = this.conversationMappings.get(conversationId);
    if (!conversation) {
      return `Cannot find conversation: ${conversationId}.`;
    }
    let conversationName = conversation.name;
    this.robot.logger.debug(`Show conversation: ${conversationId}, name: ${conversationName}`);
    if (!this._verifyPermission(receiverUserId, conversationId)) {
      return `Conversation: \`${conversationName}\` is not created by user id: ${receiverUserId}.`;
    }
    return {
      id: conversation.id,
      name: conversationName,
      status: conversation.status,
      startTime: conversation.startTime,
      allAnswers: conversation.allAnswers,
      lastQuestion: conversation.lastQuestion
    };
  }

  /**
   * Cancel a conversation.
   * If you canceled a active conversation, it will resume last pending conversation automatically.
   * If there is no pending conversation, it will return a success result.
   * Set options.single to be `false` will disable resume last pending conversation automatically.
   * @param {String} receiverUserId - `userId&roomId` or roomId.
   * @param {String} conversationId - conversation id.
   * @param {Object} options - default {single: true}, if resume last pending conversation automatically.
   * @returns {Object|Conversation} Returns result of the cancellation or the resumed conversation.
   */
  cancelConversation(receiverUserId, conversationId, options = {}) {
    let defaultOpts = {
      single: true
    };
    extend(defaultOpts, options);
    let conversation = this.conversationMappings.get(conversationId);
    if (!conversation) {
      return createResponse(new Error(`Cannot find conversation: ${conversationId}.`));
    }
    let conversationStatus = conversation.status;
    let conversationName = conversation.name;
    this.robot.logger.debug(`Cancel conversation: ${conversationId}, name: ${conversationName}`);
    if (!this._verifyPermission(receiverUserId, conversationId)) {
      return createResponse(new Error(`Conversation: ${conversationId} is not created by user id: ${receiverUserId}.`));
    }
    this.conversationMappings.get(conversationId)._clearConversationExpireTime();
    this.conversationMappings.delete(conversationId);
    if (defaultOpts.single && (conversationStatus === CONVERSATION_STATUS.ACTIVE)) {
      let lastPendingConversation = this._getLastPendingConversation(receiverUserId);
      if (lastPendingConversation && lastPendingConversation.id) {
        return this.resumeConversation(receiverUserId, lastPendingConversation.id);
      }
    }
    return createResponse(`Cancel conversation : ${conversationId} successfully.`);
  }

  _getLastPendingConversation(receiverUserId) {
    let pauseTime = 0;
    let conversation = null;
    for (let value of this.conversationMappings.values()) {
      if ((value.status === CONVERSATION_STATUS.PAUSED) && (value.receiverUserId === receiverUserId)) {
        if (value.pauseTime > pauseTime) {
          pauseTime = value.pauseTime;
          conversation = value;
        }
      }
    }
    return conversation;
  }

  /**
   * Cancel all conversations of `receiverUserId`.
   * @param {String} receiverUserId - `userId&roomId` or roomId.
   * @returns {Array.<Object>} Returns all results of the cancellation.
   */
  cancelConversations(receiverUserId) {
    this.robot.logger.debug(`Cancel all conversations of user id: ${receiverUserId}`);
    let results = [];
    for (let [id, conversation] of this.conversationMappings.entries()) {
      if (conversation.receiverUserId === receiverUserId) {
        results.push(this.cancelConversation(receiverUserId, id, {single: false}));
      }
    }
    return results;
  }

  /**
   * Get current active conversation of `receiverUserId`.
   * @param {String} receiverUserId - `userId&roomId` or roomId.
   * @returns {Conversation|Null} Returns current conversation.
   */
  getCurrentConversation(receiverUserId) {
    this.robot.logger.debug(`Try to get current active conversation of user id: ${receiverUserId}`);
    for (let value of this.conversationMappings.values()) {
      if ((value.receiverUserId === receiverUserId) && (value.status === CONVERSATION_STATUS.ACTIVE)) {
        return value;
      }
    }
    return null;
  }

  /**
   * Exists conversations.
   * @param {Object} msg - the current context.
   * @returns {Boolean} true or false.
   */
  existsConversation(msg) {
    let receiverUserId = this.getId(msg);
    this.robot.logger.debug(`Try to get exists conversation of user id: ${receiverUserId}`);
    for (let value of this.conversationMappings.values()) {
      if (value.receiverUserId === receiverUserId) {
        return true;
      }
    }
    this.robot.logger.debug(`There is no conversation of user id: ${receiverUserId}`);
    return false;
  }

  /**
   * Get `receiverUserId`.
   * @param {Object} msg - the current response.
   * @returns {String} receiverUserId - `userId&roomId` or roomId.
   */
  getId(msg) {
    let roomId = msg.room || '';
    let userId = msg.user ? msg.user.id : '';
    if (this.type === 'user') {
      if (roomId !== '') {
        return `${userId}&${roomId}`;
      }
      return userId;
    }
    return roomId !== '' ? roomId : userId;
  }

  _cleanUp() {
    for (let [id, conversation] of this.conversationMappings.entries()) {
      this.cancelConversation(conversation.receiverUserId, id);
    }
  }
  _stripBotName(text) {
    let match = text.match(new RegExp(`^(@?(?:${this.robot.name}|${this.robot.alias}):?)?(.*)`, 'i'));
    return match[2].trim();
  }

  _verifyPermission(receiverUserId, conversationId) {
    if (receiverUserId !== this.conversationMappings.get(conversationId).receiverUserId) {
      return false;
    }
    return true;
  }
}

module.exports = ConversationManager;
