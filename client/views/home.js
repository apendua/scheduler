Template.home.helpers({
  keys: function () {
    return Keys.find({});
  },
  owner: function () {
    var user = Meteor.users.findOne({_id: this.createdBy});
    return user ? user.username : '[unknown]';
  },
});

Template.home.events({
  'click [data-action="generate"]': function () {
    Meteor.call('generateApiKey', function (err, res) {
      console.log(err, res);
    });
  },

  'click [data-action="remove"]': function () {
    Keys.remove(this._id);
  },

});
