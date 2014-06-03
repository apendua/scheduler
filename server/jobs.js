Scheduler.job('test', function (res, req) {
  return "done";
});

Scheduler.job('tick', function (res, req) {
  Server.tick();
});
