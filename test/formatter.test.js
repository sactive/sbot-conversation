const {expect} = require('chai');
const {createResponse} = require('../lib/unified_formatter');


describe('unified formatter tests', function () {
  it('Error response without status test', function () {
    let res = createResponse(new Error('test error response'));
    expect(res).to.eql({code: 'error', msg: 'test error response'});
  });


  it('Error response with code test', function () {
    let res = createResponse({code: 'fail', msg: 'Error response with code test'});
    expect(res).to.eql({code: 'fail', msg: 'Error response with code test'});
  });

  it('Success response with string test', function () {
    let res = createResponse('Success response with code test');
    expect(res).to.eql({code: 'ok', msg: 'Success response with code test', data: {}});
  });

  it('Success response with object test', function () {
    let res = createResponse({name: 'xiaoming'});
    expect(res).to.deep.eql({code: 'ok', msg: 'Success.', data: {name: 'xiaoming'}});
  });
});