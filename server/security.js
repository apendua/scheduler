var userLoggedIn = function (userId) {
  return !!userId;
}

var userIsAdmin = function (userId) {
  var user = Meteor.users.findOne(userId);
  return !!user && !!user.admin;
}

Jobs.allow({
  insert: function (userId, config) {
    return !!userId && config.url && config.tick;
  },
  remove: userLoggedIn,
  update: userLoggedIn
});

Staff.allow({
  insert: userIsAdmin,
  remove: userIsAdmin,
  update: userIsAdmin
});

Keys.allow({
  insert: userLoggedIn,
  remove: function (userId, key) {
    return !!userId && key.createdBy === userId;
  },
  // update: ... not allowed
});

Scheduler.allow(userLoggedIn);
