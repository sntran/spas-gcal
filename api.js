var http = require("spas-http")
var async = require("async")

exports["getEventsMultiple"] = function (params, credentials, callback) {
  var cals = params.calendars;
  async.concat(cals, getSingleCalendar(params,credentials), function(err, items) {
    if (err) {
      callback(err, items);
    } else {
      var dates = {
        convert:function(d) {
            return (
                d.constructor === Date ? d :
                d.constructor === Array ? new Date(d[0],d[1],d[2]) :
                d.constructor === Number ? new Date(d) :
                d.constructor === String ? new Date(d) :
                typeof d === "object" ? new Date(d.year,d.month,d.date) :
                NaN
            );
        },
        compare:function(a,b) {
            return (
                isFinite(a=this.convert(a).valueOf()) &&
                isFinite(b=this.convert(b).valueOf()) ?
                (a>b)-(a<b) :
                NaN
            );
        }
      }

      items.sort(function(a,b){
        return dates.compare(a.start.date || a.start.dateTime,b.start.date || b.start.dateTime);
      });
      
      callback(null, items);
    }
  });
};

var getSingleCalendar = function(params,credentials) {
  return function(cal,cb){
    params.url = "https://www.googleapis.com/calendar/v3/calendars/" + cal + "/events";
    
    if (params.futureevents) {
      params.timeMin = new Date().toISOString();
    }
    
    http.request(params, credentials, function(err,results){
      if (err) {
        return cb(err);
      } 
      if (results.items) {
        cb(null,results.items);
      } else {
        cb(null, []);
      }
    });
  }
};
