// TODO: implement pagination
Meteor.publish('activeJobs', function () {
  "use strict";
  if (!this.userId) {
    throw new Meteor.Error(403, "Access denied.");
  }
  return Jobs.find({ status: { $in: [
    Constants.events.state.ACTIVE,
    Constants.events.state.PROCESSING
  ] } });
});

Meteor.publish('history', function () {
  "use strict";
  if (!this.userId) {
    throw new Meteor.Error(403, "Access denied.");
  }
  return Jobs.find({ status: { $nin: [
    Constants.events.state.ACTIVE,
    Constants.events.state.PROCESSING
  ] } });
});
