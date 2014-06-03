var expect = require('chai').expect;
var promise = require('../helpers').promise;

describe('Becnhmark test suite.', function () {
  var server, client;
  
  setup(function (_server, _client) {
    server = _server; client = _client;
  });
  
  it('should be able to perform a simple assertion.', function () {
    expect(true).to.be.true;
  });
  
  it('should be able to use promises.', function (done) {
    promise(client)
      .eval(function () {
        return Meteor.release;
      })
      .then(function (value) {
        expect(value).not.to.be.empty;
      })
      .always(done);
  });
});
