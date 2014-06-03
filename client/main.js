Router.configure({
  layoutTemplate: 'layoutSideMenu'
});

Meteor.startup(function () {
  $('body').addClass('pure-skin-fresh');
});