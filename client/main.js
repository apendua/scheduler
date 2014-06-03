Router.configure({
  layoutTemplate: 'layoutSideMenu'
});

Meteor.startup(function () {
  "use strict";
  console.log('scheduler started');
});
