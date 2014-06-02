Router.map(function () {
  "use strict";
  
  // CLIENT ROUTES
  this.route('home', {
    path     : '/',
    where    : 'client',
    template : 'listOfJobs'
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
    path   : '/events',
    where  : 'server',
    action : function () {
      end(this.response, 200, {});
    }
  });

  this.route('eventDetails', {
    path   : '/events/:id',
    where  : 'server',
    action : function () {
      end(this.response, 200, {});
    }
  });

  this.route('addEvent', {
    path   : '/events/when/:date/:url',
    where  : 'server',
    action : function () {
      if (this.request.method !== 'POST') {
        badMethod(this.response);
      } else {
        var id = Jobs.insert({
          url  : decodeURIComponent(this.params.url),
          when : moment(this.params.when).toDate()
        });
        end(this.response, 200, {});
      }
    }
  });
  
});
