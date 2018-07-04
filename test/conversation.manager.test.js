require('coffee-script/register');
const {expect} = require('chai');
const Helper = require('hubot-test-helper');
const helper = new Helper('./mock/scripts3.js');

let room = null;
let userName = 'pooky';
describe('flow tests', function () {
  beforeEach(function () {
    room = helper.createRoom({httpd: false});
  });
  afterEach(function () {
    room = null;
  });

  describe('conversation manager tests', function () {
    it('show conversation without id', function (done) {
      room.user.say(userName, '@hubot create user').then(function () {
        room.user.say(userName, '@hubot show conversation').then(() => {
          expect(room.messages[3][1]).to.have.property('name', 'create user');
          expect(room.messages[3][1]).to.have.property('status', 'active');
          done();
        });
      });
    });

    it('show conversation with error id', function (done) {
      room.user.say(userName, '@hubot create user').then(function () {
        room.user.say(userName, '@hubot show conversation 666').then(() => {
          expect(room.messages[3][1]).to.have.string('Cannot find conversation: 666.');
          done();
        });
      });
    });

    it('show conversation with correct id', function (done) {
      room.user.say(userName, '@hubot create user').then(function () {
        room.user.say(userName, '@hubot show conversation').then(() => {
          expect(room.messages[3][1]).to.have.property('name', 'create user');
          let id = room.messages[3][1].id;
          room.user.say(userName, `@hubot show conversation ${id}`).then(() => {
            expect(room.messages[3][1]).to.have.property('name', 'create user');
            expect(room.messages[3][1]).to.have.property('status', 'active');
            expect(room.messages[3][1]).to.have.property('id', id);
            done();
          });
        });
      });
    });

    it('show conversation all', function (done) {
      room.user.say(userName, '@hubot create user').then(function () {
        room.user.say(userName, '@hubot show conversation all').then(() => {
          expect(room.messages[3][1]).to.be.an('array');
          done();
        });
      });
    });

    it('cancel conversation all', function (done) {
      room.user.say(userName, '@hubot create user').then(function () {
        room.user.say(userName, '@hubot cancel conversation all').then(() => {
          expect(room.messages[3][1]).to.have.string('successfully');
          done();
        });
      });
    });

    it('resume conversation with correct id', function (done) {
      room.user.say(userName, '@hubot create user').then(function () {
        room.user.say(userName, '@hubot show conversation').then(() => {
          expect(room.messages[3][1]).to.have.property('name', 'create user');
          let id = room.messages[3][1].id;
          room.user.say(userName, `@hubot resume conversation ${id}`).then(() => {
            expect(room.messages[5][1]).to.have.string('successfully');
            done();
          });
        });
      });
    });
  });
});