require('coffee-script/register');
const chai = require('chai');
const expect = chai.expect;
const rewire = require('rewire');
const Helper = require('hubot-test-helper');
const helper = new Helper('../src/0_bootstrap.js');

describe('Conversation middleware', () => {
  let context, robot;
  let receiverUserId = 'zpof1d13bzmkxqhtjssq3sde';
  before(() => {
    this.room = helper.createRoom();
    robot = this.room.robot;
    context = {
      response: {
        robot: robot,
        message: {
          text: 'action callback info:callbackId$callbackKey$zpof1d13bzmkxqhtjssq3sde$integrationName$buttonName$sessionId',
          id: 'o66fu186xjnsfedzs7kx8mmkbe',
          room: '19:ytej8f1ir7rxd@riehf49j1p41c'
        },
        envelope:
          {
            room: '19:ytej8f1ir7rxd@riehf49j1p41c',
            user: {
              id: 'zpof1d13bzmkxqhtjssq3sde',
              name: 'edward',
              real_name: 'edward',
              email_address: 'edward@hpe.com',
              mm: '',
              room: '19:ytej8f1ir7rxd@riehf49j1p41c',
              room_name: '',
              activity: {sourceEvent: {channel: ''}}
            }
          }
      }
    };
  });
  after(() => {
    this.room.destroy();
  });
  it('should pass the conversation middleware', (done) => {
    robot.processStatus = {
      isCommand: false,
      isVC: false,
      isConversation: true
    };
    let receiveMsgCalled = false;
    let nextCalled = false;
    const mockNext = () => {
      nextCalled = true;
      return Promise.resolve(true);
    };
    const conMidRewire = rewire('../lib/middleware/conversation_middleware');
    conMidRewire.__set__('createDialog', () => {
      let conversation = {
        receiveMessage: () => {
          receiveMsgCalled = true;
          return Promise.resolve(true);
        }
      };
      const dialog = {
        conversationManage: {
          existsConversation: () => {
            return true;
          },
          getId: () => {
            return receiverUserId;
          },
          getCurrentConversation: () => {
            return conversation;
          }
        }
      };
      return dialog;
    });
    const conversationMiddlewareRewire = conMidRewire.__get__('conversationMiddleware');
    conversationMiddlewareRewire(context, mockNext).then((res) => {
      expect(res).to.be.true;
      expect(receiveMsgCalled).to.be.true;
      done();
    });
  });
});
