function toggleClass(element, className) {
  "use strict";
  var classes = element.className.split(/\s+/);
  var length = classes.length;
  var i;

  for (i = 0; i < length; i += 1) {
    if (classes[i] === className) {
      classes.splice(i, 1);
      break;
    }
  }
  // The className is not found
  if (length === classes.length) {
    classes.push(className);
  }

  element.className = classes.join(' ');
}

Template.layoutSideMenu.events({
  'click #menuLink': function (e, t) {
    "use strict";
    var active = 'active';
    e.preventDefault();
    toggleClass(t.find('#layout'), active);
    toggleClass(t.find('#menu'), active);
    toggleClass(t.find('#menuLink'), active);
  }
});
