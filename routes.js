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
    self.response.statusCode = code;
    self.response.setHeader("Content-Type", "application/json; character=utf-8");
    self.response.end(JSON.stringify(data));
  }
  
  function badRequest(self) {
    end(self.response, 400, {});
  }
  
  function verifyMethod(self, method, callback) {
    return function () {
      if (self.request.method === method.toUpperCase()) {
        callback.apply(self, arguments);
      } else {
        badRequest(self);
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

  this.route('test', {
    path   : '/v1/auth',
    where  : 'server',
    action : function () {
      end(this, 200, []);
    }
  });
  
  this.route('auth', {
    path   : '/v1/auth',
    where  : 'server',
    action : function () {
      end(this, 200, []);
    }
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
          end(this, 404);
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
    action : function () {
      if (this.request.method !== 'POST') {
        badRequest(this);
      } else {
        var next = getNextTick(this.params.dateOrCron);
        var job = {
          url    : this.params.url,
          status : 'Active'
        };
        if (this.request.body) {
          job.data = this.request.body;
        }
        if (next !== undefined) {
          // XXX this is probably a valid cron
          job.cron = this.params.dateOrCron;
          job.when = next;
        } else {
          // XXX not a valid cron, so probably date
          job.when = moment(this.params.dateOrCron).toDate();
        }

        end(this, 200, _.extend(job, {
          id: Jobs.insert(job)
        }));
        
        if (moment(job.when).diff() < Server.interval) {
          // XXX schedule this particular job
          Server.tick({ _id: job.id });
        }
      }
    }
  });
  
});
