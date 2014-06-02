
Template.listOfJobs.helpers({
  jobs: function () {
    "use strict";
    return Jobs.find({
      status: 'Active'
    }, { sort: {
      when: -1
    }});
  }
});

Template.listOfJobs.events({
  'click button': function () {
    "use strict";
    Jobs.remove({_id: this._id});
  },
  'submit form': function (e, t) {
    "use strict";
    e.preventDefault();
  }
});