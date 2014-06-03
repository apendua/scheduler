
Template.signIn.events({
  'submit form': function (event) {
    event.preventDefault();
    $(event.target).trigger('signin');
  }
});

Template.createAccount.events({
  'submit form': function (event) {
    event.preventDefault();
    $(event.target).trigger('signup');
  }
});

Template.resetPassword.events({
  'submit form': function (event) {
    event.preventDefault();
    $(event.target).trigger('reset');
  }
});
