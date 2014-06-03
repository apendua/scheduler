Template.history.helpers({
  jobs: function () {
    return Jobs.find({ status: { $ne: 'Active' }}, { sort: { when: -1 }});
  },
  timeStamp: function () {
    return moment(this.when || this.next).format("ddd, MMMM Do YYYY, h:mm:ss a");
  }
});

Template.history.events({
  'click button': function () {
    
  }
});
