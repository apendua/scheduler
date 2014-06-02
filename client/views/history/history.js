Template.history.helpers({
  jobs: function () {
    "use strict";
    return Jobs.find({ status: { $ne: 'Active' }}, { sort: { when: -1 }});
  }
});

Template.history.events({
  'click button': function () {
    
  }
});
