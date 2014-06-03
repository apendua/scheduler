// XXX this is fake, fix it!!!

i18n = function (value) {
  return value;
};

if (UI && UI.registerHelper) {
  UI.registerHelper('i18n', function (value) {
    return value;
  });
}
