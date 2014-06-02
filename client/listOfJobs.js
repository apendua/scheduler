
Template.listOfJobs.helpers({
  jobs: function () {
    "use strict";
    return Jobs.find();
  }
});

Template.listOfJobs.events({
  'click button': function () {
    "use strict";
    Jobs.remove({_id: this._id});
  },
  'submit form': function (e, t) {
    e.preventDefault();
  },
});