MyController = RouteController.extend({
  action: function () {
    if (Meteor.user()) {
      this.render();
    } else {
      this.render('loginRequired');
    }
  },
});

Router.map(function () {
  "use strict";
  
  // CLIENT ROUTES
  this.route('home', {
    controller : MyController,
    path       : '/',
    where      : 'client',
    waitOn     : function () {
      if (Meteor.user()) {
        return [
          Meteor.subscribe('apiKeys'),
          Meteor.subscribe('users'),
          Meteor.subscribe('staffMembers'),
        ];
      }
    },
  });
  
  this.route('listOfJobs', {
    controller : MyController,
    path       : '/listOfJobs',
    where      : 'client',
    waitOn     : function () {
      if (Meteor.user()) {
        return Meteor.subscribe('activeJobs');
      }
    }
  });

  this.route('history', {
    controller : MyController,
    path       : '/history',
    where      : 'client',
    waitOn     : function () {
      if (Meteor.user()) {
        return Meteor.subscribe('history');
      }
    }
  });

});