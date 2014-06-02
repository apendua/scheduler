var SECOND = 1000;

// TODO: figure out the optimal value
var INTERVAL = 10; // seconds

Meteor.startup(function () {
  "use strict";
  
  function update() {

    var limit = moment().add('seconds', INTERVAL).toDate();
    
    Jobs.find({
      when: { $lt: limit }
    }).forEach(function (job) {
      Meteor.setTimeout(function () {
        job = Jobs.findOne({
          _id  : job._id,
          when : job.when
        });
        if (job) {
          HTTP.get(job.url, function (err, res) {
            if (!err) {
              // TODO: decrease the retries number
              Jobs.remove(job._id);
              console.log(res);
            } else {
              console.log('JOB FAILDED:', job.url);
            }
          });
        }
      }, moment(job.when).valueOf() - moment().valueOf());
    });

    Meteor.setTimeout(update,  INTERVAL * SECOND);
  }
  
  update();
});
