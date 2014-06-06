Utils = {};

Utils.nextTick = function (cron, since) {
  var t = later.schedule(later.parse.cron(cron)).next(1, moment(since).add('seconds', 1).toDate());
  if (!isNaN(t.getTime())) {
    return t;
  }
}

Utils.parseEventTime = function (dateOrCron) {

  var job = {
    status: Constants.events.state.ACTIVE
  };

  if (Scheduler.isValidCron(dateOrCron)) {
    job.tick = Utils.nextTick(dateOrCron);
    if (!job.tick) {
      throw new Meteor.Error(400, "Invalid cron expression.");
    } else {
      job.next = job.tick;
      job.cron = dateOrCron;
    }
  } else { // probably a date
    job.tick = moment(dateOrCron);
    if (!job.tick.isValid()) {
      throw new Meteor.Error(400, "Invalid date format.");
    } else {
      job.tick = job.tick.toDate();
      job.when = job.tick;
    }
  }

  return job;
};
