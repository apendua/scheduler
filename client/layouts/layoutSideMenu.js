Template.layoutSideMenu.helpers({
  onlyIfRouteEquals: function (routeName, style) {
    var current = Router.current();
    if (current) {
      if (routeName === current.route.name) {
        return style;
      }
    }
  }
});
