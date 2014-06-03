var adminEmail = process.env.ADMIN_EMAIL || 'admin@admin';

// TODO: send verification email

Accounts.validateNewUser(function (user) {
  "use strict";
  if (!user.emails[0]) {
    return false;
  }
  if (user.emails[0].address === adminEmail) {
    return true;
  }
  if (Staff.find({ email: user.emails[0].address }).count() > 0) {
    return true;
  }
  throw new Meteor.Error(403, "Account creation is blocked.");
});

Accounts.onCreateUser(function (options, user) {
  "use strict";
  if (user.emails[0] && user.emails[0].address === adminEmail) {
    user.admin = true;
  }
  if (options.profile) {
    user.profile = options.profile;
  }
  return user;
});
