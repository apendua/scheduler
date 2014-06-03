Observable = function (value, equals) {
  "use strict";
  var dependency = new Deps.Dependency();
  equals = equals || EJSON.equals;
  this.set = function (newValue) {
    if (_.isFunction(newValue)) {
      newValue = newValue(value);
    }
    if (!equals(value, newValue)) {
      value = newValue;
      dependency.changed();
    }
  };
  this.get = function (key) {
    dependency.depend();
    if (arguments.length > 0) {
      return value && value[key];
    }
    return value;
  };
  this.spy = function () {
    return value;
  };
  this.is = function (anotherValue) {
    dependency.depend();
    return value === anotherValue;
  };
  this.is.not = function (anotherValue) {
    dependency.depend();
    return value !== anotherValue;
  };
};
