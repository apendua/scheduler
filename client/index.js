Template.listOfJobs.helpers({
  jobs: function () {
    "use strict";
    return Jobs.find();
  }
});

Meteor.startup(function () {
  "use strict";
  console.log('scheduler started');
});
