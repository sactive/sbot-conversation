const _ = require('lodash');
const {Validator} = require('jsonschema');
const {
  CONVERSATION_SCHEMA_TYPE
} = require('./constants');

/**
 * Create a new `ConversationSchema`.
 * @class
 * @private
 */
class ConversationSchema {
  /**
   * @constructs ConversationSchema
   * @param {hubot.Robot} robot - instance of hubot's `Robot`.
   * @param {String} name - schema name.
   * @param {Object} schema - json schema.
   */
  constructor(robot, name, schema) {
    this.robot = robot;
    this.name = name;
    this.steps = [];
    this.schema = schema;
  }

  /**
   * Validate input.
   * @param {String|Object} inputData - input.
   * @param {Object} validation - validation of json schema.
   * @returns {Object} Returns the validate result.
   */
  validate(inputData, validation) {
    this.robot.logger.debug(`Validate inputData : ${inputData}, validation: ${JSON.stringify(validation)}`);
    let v = new Validator();
    let final = {
      status: true,
      message: null
    };
    let result = v.validate(inputData, validation);
    if (result.errors.length > 0) {
      final.status = false;
      let msg = result.errors[0] ? result.errors[0].message : null;
      final.message = `\`${inputData}\` ${msg}`;
    }
    this.robot.logger.debug(`Validate result: ${JSON.stringify(final)}`);
    return final;
  }

  /**
   * Validate input.
   * @param {String|Object} inputData - input.
   * @returns {Object} Returns the validate result.
   */
  validateAll(inputData) {
    this.robot.logger.debug(`Validate ${JSON.stringify(inputData)}`);
    let v = new Validator();
    let final = {
      status: true,
      message: null
    };
    let result = v.validate(inputData, this.schema);
    if (result.errors.length > 0) {
      final.status = false;
      let errs = _.each(result.errors, err => {
        return err.message;
      });
      let msg = errs.join('\n');
      final.message = `\`${this.name}\` ${msg}`;
    }
    return final;
  }

  /**
   * Init conversation schema.
   * @returns {Object} Returns the conversation schema.
   */
  init() {
    if (!this.schema.type) {
      throw new Error('Schema type is required');
    }
    switch (this.schema.type) {
      case CONVERSATION_SCHEMA_TYPE.DYNAMIC:
        if (!_.isArray(this.schema.steps)) {
          throw new Error('Schema steps should listed an array');
        }
        if (_.isEmpty(this.schema.steps)) {
          throw new Error('Schema steps cannot be null');
        }
        return this.generateDynamicSteps(this.schema, this.name);
      case CONVERSATION_SCHEMA_TYPE.JSON_SCHEMA:
        return this.generateJsonSteps(this.schema, this.name);
      default:
        throw new Error(`Unsupported schema type: ${this.schema.type}`);
    }
  }

  generateJsonSteps(data, name) {
    let question = `\`${name}\` has`;
    if (data.required && data.required.length > 0) {
      question += ` mandatory attribute(s) (${data.required.join(', ')})`;
    }
    let optional = _
      .chain(data.properties)
      .keys()
      .filter(item => !data.required.includes(item))
      .value();
    if (optional.length > 0) {
      question += ` and optional attribute(s) (${optional.join(', ')})`;
    }
    question += '. Please enter specific attribute(s). example: [attribute]:[value], ...';
    this.steps.push({
      question: question,
      answer: {
        type: 'object'
      }
    });
  }

  generateDynamicSteps(data, name) {
    let result = [];
    for (let k in data.steps) {
      result.push(this.steps.push(data.steps[k]));
    }
    return result;
  }
}

module.exports = ConversationSchema;
