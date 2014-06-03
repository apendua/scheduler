
var tab = new Observable('signIn');
var session = new ReactiveDict();

Template.loginDialog.rendered = function () {
  this.data && tab.set(this.data.startOnTab || 'signIn');
};

Template.loginDialog.events({
  'signin form': function (event, template) {
    var data = $(event.target).formToJSON();

    Meteor.loginWithPassword(data.user, data.password, function (error) {
      if (error)
        session.set('loginMessage', error.toString());
      else {
        $(event.target).find('input[name=password]').val(''); // for sfety
        session.set('loginMessage', '');
        Crater.dismissOverlay(event.target);
      }
    });
  },

  'signup form': function (event, template) {
    // TODO: check if password matches
    // TODO: check if all data is provided
    var data = $(event.target).formToJSON();

    Accounts.createUser({
      username : data.username,
      password : data.password,
      email    : data.email,
    }, function (error) {
      if (error) {
        session.set('loginMessage', error.toString());
      } else {
        Crater.dismissOverlay(event.target);
      }
    });
  },

  'reset form': function (event, template) {
    var data = $(event.target).formToJSON();
    session.set('loginMessage', 'feature currently not implemented');
  },

  'click a[href^=#]': function (event) {
    tab.set(event.target.hash.slice(1));
  },

  'click button[class$=close]': function () {
    Crater.dismissOverlay(event.target);
  },
});

Template.loginDialog.helpers({

  tab: function () {
    return tab.get();
  },

  messages: function () {
    var messages = [],
        loginMessage = session.get('loginMessage');
    if (loginMessage) {
      messages.push(loginMessage);
    }
    return messages;
  },

  titleFor: function (tab) {
    switch (tab) {
      case 'signIn':
        return 'Sign in';
      case 'resetPassword':
        return 'Reset password';
      case 'createAccount':
        return 'Create a new account';
      default:
        return '';
    }
  },

  getFormByName: function () {
    return Template[tab.get()];
  },
  
});
