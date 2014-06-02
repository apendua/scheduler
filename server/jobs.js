Scheduler.job('someJob', function (res, req) {
  console.log('performing some job');
  return [];
});

Scheduler.job('anotherJob', function (res, req) {
  console.log('performing some job');
  return {};
});
