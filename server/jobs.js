Scheduler.job('test', function (data) {
  console.log('executing test job at', moment().format());
  console.log(data);
  return { result: "done" };
});

Scheduler.job('tick', function (data) {
  Server.tick();
  return { result: "done" };
});
