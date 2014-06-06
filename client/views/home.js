Template.home.helpers({
  keys: function () {
    return Keys.find({});
  },
  staff: function () {
    return Staff.find({});
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

  'submit form': function (e, t) {
    var data;
    e.preventDefault();
    data = $(e.target).formToJSON();
    Staff.insert(data);
  },

  'click [data-action="kickoff"]': function () {
    Staff.remove(this._id);
  },

});
