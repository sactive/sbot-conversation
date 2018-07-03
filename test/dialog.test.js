require('coffee-script/register');
const {expect} = require('chai');
const conversationManager = require('..');
const Helper = require('hubot-test-helper');
const robot = new Robot('hubot/src/adapters', 'shell');
const helper = new Helper('./mock/scripts.js');

let MANAGER_USER = null;
let MANAGER_ROOM = null;
let room = null;
let switchBoard = null;
let userName = 'pooky';
let receiverUserId= null;
describe('Hubot conversation manager tests', function () {
  before(function () {
    
  })
});