var SECOND = 1000;

// TODO: figure out the optimal value
// TODO: we could set this one with an env variable
var INTERVAL = 10; // seconds

Meteor.startup(function () {
  "use strict";
  
  (function update() {

    var limit = moment().add('seconds', INTERVAL).toDate();
    
    Jobs.find({
      when   : { $lt: limit },
      status : 'Active'
    }).forEach(function (job) {
      Meteor.setTimeout(function () {
        job = Jobs.findOne({
          _id    : job._id,
          when   : job.when,
          status : 'Active'
        });
        if (job) {
          HTTP.post(job.url, function (err, res) {
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
    
    Meteor.setTimeout(update,  INTERVAL * SECOND);
  }());

});
