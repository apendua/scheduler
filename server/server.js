var Fiber = Npm.require('fibers');
var connectHandlers = WebApp.connectHandlers;

var forbidden = function (res) {
  "use strict";
  res.statusCode = 403;
  res.setHeader("Content-Type", "application/json; character=utf-8");
  res.end(JSON.stringify({
    error   : 403,
    reason  : "access denied",
    details : "you have no permissions to upload files"
  }));
};

connectHandlers
  .use(function (req, res, next) {
    "use strict";
    if (req.url === "/events") {
      console.log(req.headers);
    }
    next();
  })
  .use(function (req, res, next) {
    "use strict";

    if (req.url === "/events") {

      //var token = req.body.uploadToken;

      //if (!_.has(Upload.__token2user__, token)) {
      //  forbidden(res);
      //  return;
      //}

      Fiber(function () {
        var jsonData = {};

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json; character=utf-8");

        res.end(JSON.stringify(jsonData));
      }).run();

    } else {
      next();
    }
  });
