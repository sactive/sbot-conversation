const {DYNAMIC_SCHEMA_MOCK, JSON_SCHEMA_MOCK} = require('./schemas');
const {initManager} = require('../..');

module.exports = function(robot) {
  let switchBoard = initManager(robot);
  robot.respond(/dynamic create user/i, msg => {
    let schema = switchBoard.initSchema('User', DYNAMIC_SCHEMA_MOCK);
    switchBoard.start(msg, 'dynamic create user', schema);
  });

  robot.respond(/create user/i, msg => {
    let schema = switchBoard.initSchema('User', JSON_SCHEMA_MOCK);
    switchBoard.start(msg, 'create user', schema);
  });
};