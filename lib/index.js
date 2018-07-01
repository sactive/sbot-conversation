const Dialog = require('./dialog');
const constants = require('./constants');

function start() {

}
module.exports = {
  start: start,
  private: {
    constants: constants,
    Dialog: Dialog
  }
};
