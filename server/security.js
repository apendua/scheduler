var userLoggedIn = function (userId) {
  return !!userId;
}

var userIsAdmin = function (userId) {
  var user = Meteor.users.findOne(userId);
  return !!user && !!user.admin;
}

Jobs.allow({
  insert: userIsAdmin,
  remove: userIsAdmin,
  update: userIsAdmin
});
