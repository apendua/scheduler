Router.map(function () {
  "use strict";
  
  // CLIENT ROUTES
  this.route('home', {
    path   : '/',
    where  : 'client',
    waitOn : function () {
      return [
        Meteor.subscribe('apiKeys'),
        Meteor.subscribe('users'),
        Meteor.subscribe('staffMembers'),
      ];
    }
  });
  
  this.route('listOfJobs', {
    path   : '/listOfJobs',
    where  : 'client',
    waitOn : function () {
      return Meteor.subscribe('activeJobs');
    }
  });

  this.route('history', {
    path   : '/history',
    where  : 'client',
    waitOn : function () {
      return Meteor.subscribe('history');
    }
  });

});