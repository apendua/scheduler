$.fn.formToJSON = function () {
  "use strict";
  var json = {};
  this.find('[name]').each(function () {
    json[this.name] = $(this).val();
  });
  return json;
};
