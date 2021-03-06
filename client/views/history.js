Template.history.helpers({
  jobs: function () {
    return Jobs.find({ status: { $nin: [
      Constants.events.state.ACTIVE,
      Constants.events.state.PROCESSING
    ] } }, { sort: { when: -1 }});
  },
  timeStamp: function () {
    return moment(this.when || this.next).format("ddd, MMMM Do YYYY, h:mm:ss a");
  }
});

Template.history.events({
  'click [data-action="clear"]': function () {
    Meteor.call('clearHistory');
  }
});
