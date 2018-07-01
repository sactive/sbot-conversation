const _ = require('lodash');
let conversationMappings = new Map([
  ['jshgfjshgdjsd', {status: 'pause', receiverUserId: 0, pauseTime: 0}]
]);

let r = _.chain(conversationMappings.values())
  .filter(item => (item.status === 'pause') && (item.receiverUserId === 0))
  .sortBy('pauseTime')
  .last()
  .value();

console.log(r)