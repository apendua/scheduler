// TODO: implement pagination
Meteor.publish('activeJobs', function () {
  "use strict";
  if (!this.userId) {
    throw new Meteor.Error(403, "Access denied.");
  }
  return Jobs.find({ status: 'Active' });
});

Meteor.publish('history', function () {
  "use strict";
  if (!this.userId) {
    throw new Meteor.Error(403, "Access denied.");
  }
  return Jobs.find({ status: { $ne: 'Active' }});
});
