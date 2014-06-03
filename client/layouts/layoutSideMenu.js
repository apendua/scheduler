Template.layoutSideMenu.helpers({
  onlyIfRouteEquals: function (routeName, style) {
    var current = Router.current();
    if (current) {
      if (routeName === current.route.name) {
        return style;
      }
    }
  },
  routes: function () {
    return [
      { route: 'home', name: 'Home', icon: 'fa fa-home' },
      { route: 'listOfJobs', name: 'Jobs', icon: 'fa fa-wrench' },
      { route: 'history', name: 'History', icon: 'fa fa-archive' }
    ];
  }
});

Template.layoutSideMenu.events({
  'click #menuLink': function (e, t) {
    e.preventDefault();
    $(t.find('#layout')).toggleClass('active');
    $(t.find('#menu')).toggleClass('active');
    $(t.find('#menuLink')).toggleClass('active');
  },
  'click a[href=#signIn]': function () {
    Crater.overlay('loginDialog', {}, function () {});
  },
  'click a[href=#signOut]': function () {
    Meteor.logout();
  }
});
