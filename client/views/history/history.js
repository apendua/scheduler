Template.history.helpers({
  jobs: function () {
    "use strict";
    return Jobs.find({ status: { $ne: 'Active' }}, { sort: { when: -1 }});
  }
});
