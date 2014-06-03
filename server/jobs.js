Scheduler.job('test', function (req, res) {
  console.log(req.body);
  return "done";
});

Scheduler.job('tick', function (req, res) {
  Server.tick();
});
