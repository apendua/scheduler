Router.map(function () {
  "use strict";
  
  // CLIENT ROUTES
  this.route('home', {
    path   : '/',
    where  : 'client'
  });
  
  this.route('listOfJobs', {
    path   : '/listOfJobs',
    where  : 'client',
    waitOn : function () {
      return Meteor.subscribe('activeJobs');
    }
  });

  this.route('history', {
    path   : '/history',
    where  : 'client',
    waitOn : function () {
      return Meteor.subscribe('history');
    }
  });

  
  // SERVER ROUTES
  function end(self, code, data) {
    if (_.isString(data)) {
      data = { code : code, message : data };
    }
    self.response.statusCode = code;
    self.response.setHeader("Content-Type", "application/json; character=utf-8");
    self.response.end(JSON.stringify(data));
  }
  
  function requireCredentials(self) {
    self.response.setHeader('WWW-Authenticate', 'Basic realm="Scheduler"');
    self.response.statusCode = 401;
    self.response.end();
  }
  
  function badRequest(self) {
    end(self.response, 400, {});
  }
  
  function verifyMethod(method, callback) {
    return function () {
      if (this.request.method === method.toUpperCase()) {
        callback.apply(this, arguments);
      } else {
        badRequest(this);
      }
    };
  }
  
  function getNextTick(cron) {
    //XXX I don't like this
    var s = later.parse.cron(cron);
    var t = later.schedule(s).next();
    if (!isNaN(t.getTime())) {
      return t;
    }
  }
  
  function authorize(callback) {
    return function () {
      var auth = this.request.headers.authorization;
      var match;
      if (!auth) {
        requireCredentials(this);
      } else {
        match = /Basic\s+([\w\d]+)/.exec(auth);
        if (!match) {
          requireCredentials(this);
        } else {
          auth = (new Buffer(match[1], 'base64')).toString().split(':');
          if (Meteor.users.find({ appKey: auth[0], appSecret: auth[1] }).count() == 0) {
            end(this, 403, 'Access denied.');
          } else {
            // TODO: we shouldn't be using "this"
            callback.apply(this);
          }
        }
      }
    };
  }

  this.route('test', {
    path   : '/v1/test',
    where  : 'server',
    action : function () {
      end(this, 200, []);
    }
  });
  
  this.route('auth', {
    path   : '/v1/auth',
    where  : 'server',
    action : authorize(function () {
      end(this, 200, []);
    })
  });
  
  this.route('listOfEvents', {
    path   : '/v1/events',
    where  : 'server',
    action : function () {
      end(this, 200,
          _.pluck(Jobs.find({ status: 'Active' }, { fields: { _id: 1 }}).fetch(), '_id')
        );
    }
  });

  this.route('eventDetails', {
    path   : '/v1/events/:id',
    where  : 'server',
    action : function () {
      var job = null;
      if (this.request.method === 'POST') {
        badRequest(this);
      } else {
        job = Jobs.findOne(this.params.id);
        if (!job) {
          end(this, 400, "Wrong cron format.");
        } else {
          if (this.request.method === 'GET') {
            // TODO: filter attributes
            end(this, 200, job);
          } else if (this.request.method === 'PUT') {
            // TODO: finish this one
            Jobs.update(this.params.id, { $set: {} });
          } else if (this.request.method === 'DELETE') {
            Jobs.remove(this.params.id);
          }
        }
      }
    }
  });

  this.route('addEvent', {
    path   : '/v1/events/when/:dateOrCron/:url',
    where  : 'server',
    action : verifyMethod('POST', function () {
      var job = {
        url    : this.params.url,
        status : Constants.events.state.ACTIVE
      };
      if (this.request.body) {
        job.data = this.request.body;
      }
      console.log(this.params.dateOrCron);
      if (Scheduler.isValidCron(this.params.dateOrCron)) {
        // XXX this is probably a valid cron
        job.tick = getNextTick(this.params.dateOrCron);
        if (!job.tick) { // XXX can we throw an error?
          end(this, 400, "Invalid cron expression.");
        } else {
          job.next = job.tick;
          job.cron = this.params.dateOrCron;
          //--------------------------------
          end(this, 200, _.extend(job, {
            id: Jobs.insert(job)
          }));
          if (moment(job.when).diff() < Server.interval) {
            // XXX schedule this particular job
            Server.tick({ _id: job.id });
          }
        }
      } else {
        // XXX ideally we should specify some accepted date formats
        job.tick = moment(this.params.dateOrCron);
        if (!job.tick.isValid()) {
          end(this, 400, "Invalid time format.");
        } else {
          job.tick = job.tick.toDate();
          job.when = job.tick;
          //----------------------------
          end(this, 200, _.extend(job, {
            id: Jobs.insert(job)
          }));
          if (moment(job.when).diff() < Server.interval) {
            // XXX schedule this particular job
            Server.tick({ _id: job.id });
          }
        }
      }

    })
  });
  
});
