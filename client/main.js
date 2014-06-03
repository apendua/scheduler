Router.configure({
  layoutTemplate  : 'layoutSideMenu',
  loadingTemplate : 'loading'
});

Router.onBeforeAction('loading');

Meteor.startup(function () {
  $('body').addClass('pure-skin-fresh');
});