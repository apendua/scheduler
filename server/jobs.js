Scheduler.job('test', function (req, res) {
  console.log(req.body);
  return { result: "done" };
});

Scheduler.job('tick', function (req, res) {
  Server.tick();
  return { result: "done" };
});
