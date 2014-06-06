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
    tick   : { $lt: limit },
    status : Constants.events.state.ACTIVE
  });
  
  Jobs.find(selector).forEach(function (job) {
    Jobs.update(job._id, { $set: {
      status: Constants.events.state.PROCESSING
    }});
    Meteor.setTimeout(function () {
      var nextTick;
      //------------------
      job = Jobs.findOne({
        _id    : job._id,
        tick   : job.tick,
        status : Constants.events.state.PROCESSING
      });
      if (job) {
        HTTP.post(job.url, {
          data: job.data
        }, function (err, res) {
          if (job.cron) {
            nextTick = later.schedule(later.parse.cron(job.cron)).next();
            Jobs.update(job._id, { $set: {
              status : Constants.events.state.ACTIVE,
              next   : nextTick,
              tick   : nextTick
            }});
          } else {
            Jobs.update(job._id, { $set: {
              status: res && res.statusCode || err && err.statusCode
            }});
          }
          if (err) {
            // TODO: decrease the retries number
            console.log('JOB FAILDED:', job.url);
          }
        });
      }
    }, moment(job.tick).valueOf() - moment().valueOf());
  });  
  
};

Meteor.startup(function () {
  "use strict";
  
  (function tick() {
    Server.tick();
    Meteor.setTimeout(tick,  Server.interval);
  }());

});
