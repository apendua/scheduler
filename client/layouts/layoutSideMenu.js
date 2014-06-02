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
      { route: 'home', name: 'Home' },
      { route: 'listOfJobs', name: 'Jobs' },
      { route: 'history', name: 'History' }
    ];
  }
});

Template.layoutSideMenu.events({
  'click #menuLink': function (e, t) {
    e.preventDefault();
    $(t.find('#layout')).toggleClass('active');
    $(t.find('#menu')).toggleClass('active');
    $(t.find('#menuLink')).toggleClass('active');
  }
});
