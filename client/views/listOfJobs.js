
Template.listOfJobs.rendered = function () {
  $(this.find('[name=time]')).datetimepicker();
};

Template.listOfJobs.helpers({
  jobs: function () {
    "use strict";
    return Jobs.find({
      status: 'Active'
    }, { sort: {
      when: -1
    }});
  },
  timeStamp: function () {
    return moment(this.when || this.next).format("ddd, MMMM Do YYYY, h:mm:ss a");
  }
});

Template.listOfJobs.events({
  'click button': function () {
    Jobs.remove({_id: this._id});
  },
  'submit form': function (e, t) {
    e.preventDefault();
  }
});
