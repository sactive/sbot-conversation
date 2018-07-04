require('coffee-script/register');
const {expect} = require('chai');
const Helper = require('hubot-test-helper');
const helper = new Helper('./mock/scripts2.js');

let room = null;
let userName = 'pooky';
describe('conversation middleware tests', function () {
  beforeEach(function () {
    room = helper.createRoom({httpd: false});
  });
  afterEach(function () {
    room = null;
  });

  describe('conversation flow tests', function () {
    it('conversation json schema flow test', function (done) {
      room.user.say(userName, '@hubot create user').then(function () {
        expect(room.messages[1][1]).to.have.string('`User` has mandatory attribute(s) (name, email) and optional attribute(s) (employeeNum, gender)');
        room.user.say(userName, '@hubot name: shipengqi').then(() => {
          expect(room.messages[3][1]).to.have.string('User` instance requires property "email"');
          room.user.say(userName, '@hubot email: shipengqi').then(() => {
            expect(room.messages[5][1]).to.have.string('instance.email does not conform to the "email" format');
            room.user.say(userName, '@hubot email: 126513765@test.com').then(() => {
              expect(room.messages[7][1]).to.have.string('done');
              done();
            })
          })
        });
      });
    });

    it('conversation dynamic schema flow test', function (done) {
      room.user.say(userName, '@hubot dynamic create user').then(function () {
        expect(room.messages[1][1]).to.have.string('Start create a user');
        room.user.say(userName, '@hubot shipengqi').then(() => {
          expect(room.messages[3][1]).to.have.string('Please enter your user email.');
          room.user.say(userName, '@hubot 126513765@test.com').then(() => {
            expect(room.messages[5][1]).to.have.string('type [skip] to continue');
            room.user.say(userName, '@hubot skip').then(() => {
              expect(room.messages[7][1]).to.have.string('Please enter gender enum');
              room.user.say(userName, '@hubot female').then(() => {
                expect(room.messages[9][1]).to.have.string('Create user successfully');
                done();
              })
            })
          })
        });
      });
    });
  });
});