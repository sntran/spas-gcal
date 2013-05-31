var http = require("spas-http")
var async = require("async")

exports["getEventsMultiple"] = function (params, credentials, callback) {
	var cals = params.calendars;
	async.concat(cals, getSingleCalendar(params,credentials), callback);
};

var getSingleCalendar = function(params,credentials) {
	return function(cal,cb){
		params.url = "http://www.google.com/calendar/feeds/" + cal + "/public/full"
		http.request(params, credentials, function(err,results){
			if (err) {
				cb(err);
			} else {
				if (results.data && results.data.items) {
					cb(null,results.data.items);
				} else {
					cb(null, []);
				}
			}
		});
	}
};