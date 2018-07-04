require('coffee-script/register');
const {expect} = require('chai');
const Helper = require('hubot-test-helper');
const helper = new Helper('./mock/scripts.js');

let room = null;
let userName = 'pooky';
describe('Dialog tests', function () {
  beforeEach(function () {
    room = helper.createRoom({httpd: false});
  });
  afterEach(function () {
    room = null;
  });
  describe('register conversation tests', function () {
    it('register create user', function (done) {
      room.user.say(userName, '@hubot create user').then(function () {
        expect(room.messages[1][1]).to.have.string('`User` has mandatory attribute(s) (name, email) and optional attribute(s) (employeeNum, gender)');
        room.user.say(userName, '@hubot name: shipengqi').then(() => {
          expect(room.messages[2][1]).to.have.string('name: shipengqi');
          done();
        });
      });
    });

    it('register dynamic create user', function (done) {
      room.user.say(userName, '@hubot dynamic create user').then(function () {
        expect(room.messages[1][1]).to.have.string('Start create a user');
        room.user.say(userName, '@hubot shipengqi').then(() => {
          expect(room.messages[2][1]).to.have.string('shipengqi');
          done();
        });
      });
    });
  });
});