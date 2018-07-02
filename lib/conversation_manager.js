const {CONVERSATION_STATUS} = require('./constants');

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
   * @param {Conversation} conversation - a new conversation.
   * @returns {Conversation} Returns current conversation instance.
   */
  addConversation(conversation) {
    let response;
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
      response = this.cancelConversation(receiverUserId, conversation.id, options);
      response = response.replace(response.split('\n')[0], '');
      if (response.includes('There is no active conversation.')) {
        return;
      }
      conversation.msg.send(response);
    });

    conversation.on('expired', () => {
      this.robot.logger.info(`Conversation: ${conversation.id} is expired`);
      response = `Conversation: ${conversation.id}. \nConversation \`${conversation.name}\` expired.`;
      this.cancelConversation(receiverUserId, conversation.id, options);
      conversation.msg.send(response);
    });

    conversation.on('close', () => {
      this.robot.logger.info(`Conversation: ${conversation.id} is closed`);
      this.cancelConversation(receiverUserId, conversation.id, options);
    });

    return conversation;
  }

  /**
   * Resume a conversation.
   * @param {String} receiverUserId - `userId&roomId` or userId.
   * @param {String} conversationId - conversation id.
   * @returns {String} Returns resume conversation message.
   */
  resumeConversation(receiverUserId, conversationId) {
    let conversation = this.conversationMappings.get(conversationId);
    if (!conversation) {
      return `Cannot find conversation: ${conversationId}.`;
    }
    let conversationName = conversation.name;
    let lastQuestion = '';
    let lastReply = '';
    this.robot.logger.debug(`Resume conversation: ${conversationId}, name: ${conversationName}`);
    if (!this._verifyPermission(receiverUserId, conversationId)) {
      return `Conversation: \`${conversationName}\` is not created by user: ${receiverUserId}`;
    }
    this.pauseConversations(receiverUserId);
    this.conversationMappings.get(conversationId).resume();
    if (conversation.lastQuestion) {
      lastQuestion = conversation.lastQuestion;
    }
    if (conversation.lastReply) {
      lastReply = `\n**Last reply:** ${conversation.lastReply}`;
    }
    return `Resume conversation \`${conversationName}\`: ${conversationId} successfully. \n**Last question:** ${lastQuestion} ${lastReply}`;
  }

  /**
   * Pause a conversation.
   * @param {String} receiverUserId - `userId&roomId` or userId.
   * @param {String} conversationId - conversation id.
   * @returns {String} Returns pause conversation message.
   */
  pauseConversation(receiverUserId, conversationId) {
    let conversation = this.conversationMappings.get(conversationId);
    if (!conversation) {
      return `Cannot find conversation: ${conversationId}.`;
    }
    let conversationName = conversation.name;
    this.robot.logger.info(`Pause conversation: ${conversationId}, name: ${conversationName}`);
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
   * @param {String} receiverUserId - `userId&roomId` or userId.
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
   * Get all conversations.
   * @param {String} receiverUserId - `userId&roomId` or userId.
   * @returns {Array.<Conversation>} Returns the conversations of `receiverUserId`.
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
   * Get a conversation.
   * @param {String} receiverUserId - `userId&roomId` or userId.
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
   * @param {String} receiverUserId - `userId&roomId` or roomId.
   * @param {String} conversationId - conversation id.
   * @param {Object} options - cancel single, e.g. {single: true}.
   * @returns {String} Returns cancel conversation message.
   */
  cancelConversation(receiverUserId, conversationId, options = {}) {
    let conversation = this.conversationMappings.get(conversationId);
    if (!conversation) {
      return `Cannot find conversation: ${conversationId}.`;
    }
    let conversationStatus = conversation.status;
    let conversationName = conversation.name;
    let resumeRes = '';
    this.robot.logger.debug(`Cancel conversation: ${conversationId}, name: ${conversationName}`);
    if (!this._verifyPermission(receiverUserId, conversationId)) {
      return `Conversation: \`${conversationName}\` is not created by user id: ${receiverUserId}.`;
    }
    this.conversationMappings.get(conversationId)._clearConversationExpireTime();
    this.conversationMappings.delete(conversationId);
    if (options.single && (conversationStatus === CONVERSATION_STATUS.ACTIVE)) {
      let lineBreak = '\n';
      let lastPendingConversation = this._getLastPendingConversation(receiverUserId);
      if (lastPendingConversation && lastPendingConversation.id) {
        resumeRes = this.resumeConversation(receiverUserId, lastPendingConversation.id);
        resumeRes = lineBreak + resumeRes;
      } else {
        resumeRes = lineBreak + 'There is no active conversation.';
      }
    }
    return `Cancel conversation \`${conversationName}\`: ${conversationId} successfully. ${resumeRes}`;
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
   * Cancel all conversations.
   * @param {String} receiverUserId - `userId&roomId` or userId.
   * @returns {String} Returns cancel all conversations message.
   */
  cancelConversations(receiverUserId) {
    this.robot.logger.debug(`Cancel all conversations of user id: ${receiverUserId}`);
    let results = [];
    for (let [id, conversation] in this.conversationMappings.entries()) {
      if (conversation.receiverUserId === receiverUserId) {
        results.push(this.cancelConversation(receiverUserId, id));
      }
    }
    return results.join('\n');
  }

  /**
   * Get current active conversation.
   * @param {String} receiverUserId - `userId&roomId` or userId.
   * @returns {Conversation|Null} Returns current conversation.
   */
  getCurrentConversation(receiverUserId) {
    this.robot.logger.debug(`Try to get current active conversation of user id: ${receiverUserId}`);
    for (let value in this.conversationMappings.values()) {
      if ((value.receiverUserId === receiverUserId) && (value.status === CONVERSATION_STATUS.ACTIVE)) {
        return value;
      }
    }
    return null;
  }

  /**
   * Exists conversations.
   * @param {Object} msg - the current context.
   */
  existsConversation(msg) {
    let receiverUserId = this.getId(msg);
    this.robot.logger.debug(`Try to get exists conversation of user id: ${receiverUserId}`);
    for (let value in this.conversationMappings.values()) {
      if (value.receiverUserId === receiverUserId) {
        return true;
      }
    }
    this.robot.logger.debug(`There is no conversation of user id: ${receiverUserId}`);
    return false;
  }

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
    for (let [id, conversation] in this.conversationMappings.entries()) {
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
