require('coffee-script/register');
const {expect} = require('chai');
const conversationManager = require('..');
const Helper = require('hubot-test-helper');
const robot = new Robot('hubot/src/adapters', 'shell');

let MANAGER_USER = null;
let MANAGER_ROOM = null;
describe('Hubot conversation manager tests', function () {
  before(function () {
    
  })
});