Router.map(function () {
  "use strict";
  
  // CLIENT ROUTES
  this.route('home', {
    path  : '/',
    where : 'client'
  });
  
  this.route('listOfJobs', {
    path  : '/listOfJobs',
    where : 'client'
  });

  this.route('history', {
    path  : '/history',
    where : 'client'
  });

  
  // SERVER ROUTES
  function end(response, code, data) {
    response.statusCode = code;
    response.setHeader("Content-Type", "application/json; character=utf-8");
    response.end(JSON.stringify(data));
  }
  
  function badMethod(response) {
    end(response, 400, {});
  }
  
  this.route('listOfEvents', {
    path   : '/v1/events',
    where  : 'server',
    action : function () {
      end(this.response, 200,
          _.pluck(Jobs.find({ status: 'Active' }, { fields: { _id: 1 }}).fetch(), '_id')
        );
    }
  });

  this.route('eventDetails', {
    path   : '/v1/events/:id',
    where  : 'server',
    action : function () {
      var job = null;
      if (this.request.method === 'POST') {
        badMethod(this.response);
      } else {
        job = Jobs.findOne(this.params.id);
        if (!job) {
          end(this.response, 404);
        } else {
          if (this.request.method === 'GET') {
            // TODO: filter attributes
            end(this.response, 200, job);
          } else if (this.request.method === 'PUT') {
            // TODO: finish this one
            Jobs.update(this.params.id, { $set: {} });
          } else if (this.request.method === 'DELETE') {
            Jobs.remove(this.params.id);
          }
        }
      }
    }
  });

  this.route('addEvent', {
    path   : '/v1/events/when/:date/:url',
    where  : 'server',
    action : function () {
      if (this.request.method !== 'POST') {
        badMethod(this.response);
      } else {
        var job = {
          url    : decodeURIComponent(this.params.url),
          when   : moment(this.params.date).toDate(),
          status : 'Active'
        };
        end(this.response, 200, _.extend(job, {
          _id: Jobs.insert(job)
        }));
      }
    }
  });
  
});
