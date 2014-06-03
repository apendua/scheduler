var SECOND = 1000;

// TODO: figure out the optimal value
// TODO: we could set this one with an env variable

Server = {
  interval: 20 * SECOND
};

Server.tick = function (selector) {

  var limit = moment().add('milliseconds', Server.interval).toDate();

  selector = selector || {};
  _.extend(selector, {
    when   : { $lt: limit },
    status : 'Active'
  });
  
  Jobs.find(selector).forEach(function (job) {
    Meteor.setTimeout(function () {
      job = Jobs.findOne(_.extend(selector, {
        _id  : job._id,
        when : job.when,
      }));
      if (job) {
        HTTP.post(job.url, {
          data: job.data
        }, function (err, res) {
          if (job.cron) {
            Jobs.update(job._id, { $set: {
              when: later.schedule(later.parse.cron(job.cron)).next()
            }});
          } else {
            Jobs.update(job._id, { $set: {
              status: res.statusCode
            }});
          }
          if (err) {
            // TODO: decrease the retries number
            console.log('JOB FAILDED:', job.url);
          }
        });
      }
    }, moment(job.when).valueOf() - moment().valueOf());
  });  
  
};

Meteor.startup(function () {
  "use strict";
  
  (function tick() {
    Server.tick();
    Meteor.setTimeout(tick,  Server.interval);
  }());

});
