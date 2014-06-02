var SCHEDULER_URL = 'http://localhost:3000';

Cron = {};

function getApiUrl(path, options) {
  "use strict";
  return SCHEDULER_URL + path.replace(/:\w+/g, function (attrName) {
    return encodeURIComponent(options[attrName.substr(1)]);
  });
}

Cron.addEvent = function (url, date) {
  "use strict";
  HTTP.post(getApiUrl('/events/when/:date/:url', {
    url    : url,
    date   : date
  }), function (err, res) {
    console.log(err, res);
  });
};
