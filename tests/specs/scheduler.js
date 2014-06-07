var expect = require('chai').expect;
var promise = require('../helpers').promise;
var throttle = require('../helpers').throttle;

// TODO: add test to see if job is only triggered once

describe('Scheduler.', function () {
  "use strict";
  
  var server, client;
  
  setup(function (_server, _client) {
    server = _server; client = _client;
  });
  
  before(function (done) {
    promise(server)
      .eval(function () {
        Scheduler.job('testJob', function (data) {
          emit('testJob', data.value);
        });
      })
      .always(done);
  });
  
  describe('Given not authorized access,', function () {

    it('should be able to ping the scheduling server.', function (done) {
      promise(client)
        .eval(function () {
          Scheduler.ping(function () {
            emit('pong');
          });
        })
        .once('pong', function () {
          done();
        });
    });

    it('should not be able to do anything else.', function (done) {    
      promise(client)
        .evalAsync(function () {
          Scheduler.checkAuth(function (err, res) {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          });
        })
        .then(function () {
          throw new Error('Error was not thrown.');
        }, function (err) {
          expect(err.toString()).to.contain('40'); // it may be either 401 or 403
        })
        .always(done);
    });
  });

  describe('Given the user is logged in,', function () {
  
    before(function (done) {
      promise(server)
        .eval(function () {
          // make sure this user can be created
          Staff.insert({ email: 'dude@some.domain' });
          // create the user
          Accounts.createUser({
            username : 'dude',
            email    : 'dude@some.domain',
            password : '123'
          });
          // generate credentials for this particular user
          Keys.insert({
            apiKey: 'dudeKey', apiSecret: 'dudeSecret'
          });
        })
      .switchTo(client)
        .login('dude', '123')
        .always(done);
    });
    
    describe('but uses improper credentials,', function () {
      before(function (done) {
        promise(server)
          .eval(function () {
            Scheduler.configure({
              auth: 'improper:credentials'
            });
          })
          .always(done);
      });

      it('should not be able to pass the authentication test.', function (done) {
        promise(client)
          .evalAsync(function () {
            // TODO: this done suggests it has something to do with the other done
            Scheduler.checkAuth(done);
          })
          .expectError(function (err) {
            expect(err.toString()).to.contain('403');
          })
          .always(done);
      });

    });

    describe('and uses proper credentials,', function () {
    
      before(function (done) {
        promise(server)
          .eval(function () {
            Scheduler.configure({
              auth: 'dudeKey:dudeSecret'
            });
          })
        .always(done);
      });
      
      it('should not be able to pass the authentication test.', function (done) {    
        promise(client)
          .evalAsync(function () {
            Scheduler.checkAuth(function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          })
          .then(function (res) {
            expect(res).to.be.ok;
          })
          .always(done);
      });
      
      it('should be able to trigger an existing job with arguments.', function (done) {
        // TODO: test the time difference
        // TODO: this should be tested on client

        var timestamp = Date.now();

        promise(client)
          .eval(function () {
            Scheduler.addEvent('testJob', moment().add('seconds', 3).toISOString(), { value: 12345 });
          })
        .switchTo(server)
          .once('testJob', function (value) {
            expect(value).to.eql(12345);
            return Date.now() - timestamp;
          })
          .then(function (value) {
            expect(value).to.be.ok;
          })
          .always(done);
      });
    });
  
  });

});
