const moment = require('moment');
const series = require('async-series');
const _ = require('lodash');
const {EventEmitter} = require('events');
const {
  CONVERSATION_STATUS,
  DEFAULT_EXPIRE_TIME,
  CONVERSATION_SCHEMA_TYPE
} = require('./constants');

class Conversation extends EventEmitter {
  /**
    * Extends the EventEmitter.
    * @constructs Conversation
    * @param {hubot.Robot} @robot - instance of hubot's `Robot`.
    * @param {object} msg - the current response.
    * @param {string} receiverUserId - `userId&roomId` or roomId.
    * @param {string} conversationName - conversation name.
    * @param {object} schema - schema object.
    * @param {number} expireTime - expire time.
  */
  constructor(robot, msg, receiverUserId, conversationName, schema, expireTime) {
    super();
    this.id = new Date().getTime();
    this.conversationSchema = schema || null;
    this.name = conversationName;
    this.status = CONVERSATION_STATUS.ACTIVE;
    this.robot = robot;
    this.msg = msg;
    this.receiverUserId = receiverUserId;
    this.allAnswers = [];
    this.lastQuestion = null;
    this.startTime = moment.utc();
    this.pauseTime = null;
    this.expireTime = expireTime || DEFAULT_EXPIRE_TIME;
    this.expiration = null;
    this.choices = [];
  }

  /**
    * Start a conversation.
    * @param {object} msg - the current response.
  */
  start(msg) {
    this.robot.logger.info(`Conversation ID: ${this.id} start`);
    let callbacks = [];
    if (this.conversationSchema) {
      _.each(this.conversationSchema.steps, step => {
        callbacks.push(done => {
          this._invokeDialog(msg, step, done);
        });
      });

      return series(callbacks, err => {
        if (!err) {
          let completeMessage = this.conversationSchema.schema.onCompleteMessage || 'Thank you. Done!';
          this.msg.send(completeMessage);
          this._end(this.allAnswers);
        } else {
          this.robot.logger.error(`Conversation ID: ${this.id} execute with error: ${err.message}`);
          this.msg.send(err.message);
        }
      });
    }
  }

  /**
    * Resume a conversation.
  */
  resume() {
    this.status = CONVERSATION_STATUS.ACTIVE;
  }

  /**
    * Pause a conversation.
  */
  pause() {
    this.status = CONVERSATION_STATUS.PAUSED;
    this.pauseTime = moment().unix();
  }

  /**
    * Accepts an incoming message, tries to match against the registered choices.
    * @param {object} msg - the current response.
  */
  receiveMessage(msg) {
    this.msg = msg;
    let text = msg.message.text;
    this.robot.logger.info(`Conversation ID: ${this.receiverUserId} receive message: ${text}`);
    this.executeChoicesHandler(msg, text);
  }

  /**
    * Registers a new choice for this dialog.
    * @param {regex} regex - Expression to match.
    * @param {Function} handler - Handler function when matched.
  */
  addChoice(regex, handler) {
    this.choices.push({regex: regex, handler: handler});
    this._reSetConversationExpireTime();
  }

  /**
    * After a choice is made, the timer is cleared.
    * @param {object} msg - the current response.
    * @param {string} text - msg.message.text.
  */
  executeChoicesHandler(msg, text) {
    let matched = false;
    matched = this.choices.some(choice => {
      let match = text.match(choice.regex);
      if (match) {
        if (!this.conversationSchema) {
          this._reSetChoice();
        }
        this._reSetConversationExpireTime();
        choice.handler(msg);
        return true;
      }
    });
    if (!matched) {
      // @_reSetChoice()
      this._reSetConversationExpireTime();
    }
  }

  addSkip(step, done) {
    if (!step.required) {
      let skipKeyword = this.conversationSchema.schema.skipKeyword || /\bskip\b$/i;
      this.addChoice(toRegExp(skipKeyword), dialogMessage => {
        this._reSetChoice();
        done();
      });
    }
  }

  addChoiceQuestion(step, done) {
    for (let k in step.answer.options) {
      let v = step.answer.options[k];
      this.addChoice(toRegExp(v.match), dialogMessage => {
        let input = this._parseMessage(dialogMessage.message.text);
        this.updateAnswers(input, step.entityName);
        done();
      });
    }
  }

  addTextQuestion(step, done) {
    this.addChoice(/^(?!\s*$).+/i, dialogMessage => {
      let input = this._parseMessage(dialogMessage.message.text);
      this.validateInput(step, input, done);
    });
  }

  addObjectQuestion(step, done) {
    this.addChoice(/.*/i, dialogMessage => {
      let string = this._parseMessage(dialogMessage.message.text);
      let inputData = {};
      try {
        let arr = string.split(',').map(item => {
          let temp = item.trim().split(':');
          return {
            key: temp[0].trim(),
            value: this._isNumber(temp[1].trim())
          };
        });
        for (let k in arr) {
          let v = arr[k];
          inputData[v.key] = v.value;
        }
      } catch (err) {
        this.robot.logger.error(`Parse string: ${string} error`);
        this.lastReply = 'Format error, example: [attribute]:[value], ...';
        this.msg.send(this.lastReply);
        return;
      }
      this.robot.logger.info(`Parse result: ${JSON.stringify(inputData)}`);
      this.received = _.assignIn(this.received, inputData);
      let result = this.conversationSchema.validateAll(this.received);
      if (result.status) {
        this.updateAnswers(this.received);
        return done();
      } else {
        this.lastReply = `So far I have \`${JSON.stringify(this.received).replace(/"/g, '')}\`, \nbut ${result.message}, Give me the rest.`;
        this.msg.send(this.lastReply);
      }
    });
  }

  _parseMessage(text) {
    if (!text) {
      return text;
    }
    text = this._stripBotName(text);
    let tempText = text;
    let transformText = _.toNumber(tempText);
    if (_.isNaN(transformText) || !transformText) {
      return text;
    }
    return transformText;
  }

  _isNumber(value) {
    let tempValue = value;
    let transValue = _.toNumber(tempValue);
    if (_.isNaN(transValue) || !transValue) {
      return value;
    }
    return transValue;
  }

  validateInput(step, input, done) {
    if (step.answer.validation && _.isPlainObject(step.answer.validation)) {
      let result = this.conversationSchema.validate(input, step.answer.validation);
      if (!result.status) {
        this.msg.send(`Invalid value. \n${result.message}`);
      } else {
        this.updateAnswers(input, step.entityName);
        done();
      }
    } else {
      this.updateAnswers(input, step.entityName);
      done();
    }
  }

  /**
    * Update all answers.
    * @param {string} value - answer.
  */
  updateAnswers(value, key) {
    if (key) {
      let answer = {};
      answer[key] = value;
      this.allAnswers.push(answer);
    } else {
      this.allAnswers.push(value);
    }
    this._reSetChoice();
  }

  /**
    * Update last question.
    * @param {String} question - question.
  */
  updateQuestion(question) {
    this.lastQuestion = question;
  }

  /**
    * Invoke a dialog message with the user and collect the response into the data.
    * @param {object} msg - the current response.
    * @param {object} step - step of schema.
    * @param {Function} done - The function provided by async-series to call the next dialog message.
  */
  _invokeDialog(msg, step, done) {
    let question = step.question;
    if (!step.required && (this.conversationSchema.schema.type !== CONVERSATION_SCHEMA_TYPE.JSON_SCHEMA)) {
      let skipMessage = `\n${this.conversationSchema.schema.skipMessage || '(or type [skip] to continue)'}`;
      question += ` ${skipMessage}`;
    }
    this.msg.send(question);
    this.updateQuestion(question);
    this.addSkip(step, done);

    if (step.answer && step.answer.type === 'choice') {
      this.addChoiceQuestion(step, done);
    }

    if (step.answer && step.answer.type === 'text') {
      this.addTextQuestion(step, done);
    }

    if (step.answer && step.answer.type === 'object') {
      this.received = {};
      this.lastReply = '';
      this.addObjectQuestion(step, done);
    }
  }

  /**
    * Strip the bot's name from the description text.
    * @param {String} text - msg.message.text.
  */
  _stripBotName(text) {
    let match = text.match(new RegExp(`^(@?(?:${this.robot.name}|${this.robot.alias}):?)?(.*)`, 'i'));
    return match[2].trim();
  }

  /**
    * Clears the choices array.
  */
  _reSetChoice() {
    this.choices = [];
  }

  _end(data) {
    this.emit('end', data);
  }

  _setConversationExpireTime() {
    this.expiration = setTimeout(() => {
      this.emit('expired');
    }, this.expireTime);
  }

  _reSetConversationExpireTime() {
    this._clearConversationExpireTime();
    this._setConversationExpireTime();
  }

  _clearConversationExpireTime() {
    clearTimeout(this.expiration);
  }
}

function toRegExp(string) {
  if (string instanceof RegExp) {
    return string;
  }

  if (_.isString(string)) {
    let regex = new RegExp('^/(.+)/(.*)$');
    let match = string.match(regex);
    if (match) {
      return new RegExp(match[1], match[2]);
    }
  }

  return new RegExp(string.toString());
}

module.exports = Conversation;
