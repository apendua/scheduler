var userLoggedIn = function (userId) {
  return !!userId;
}

var userIsAdmin = function (userId) {
  var user = Meteor.users.findOne(userId);
  return !!user && !!user.admin;
}

Jobs.allow({
  insert: userLoggedIn,
  remove: userLoggedIn,
  update: userLoggedIn
});

Scheduler.allow(userLoggedIn);
