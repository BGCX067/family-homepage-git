/**
 * @author gu jun
 */

var timeline = {
	
initialize: function() {
	
	initOnload();
},

initOnload: function() {
	// get this years data when page is ready
	var _this = this,
		from = firstDayOfYear(true),
		to = firstDayOfYear(false);
	$(function() {
		_this.getActivities(from, to, genTimeline);
	});
},

};

timeline.__proto__ = {
	
genTimeline: function(container) {
	
},
	
firstDayOfYear: function(flag) {
	var today = new Date(),
		year = today.getFullYear() + flag ? 0 : 1,
		firstDay = year + '-01-01';
	return firstDay;
},

getActivities: function(from, to, callback) {
	var _this = this,
		from,
		to,
		callback;
	if (arguments.length == 1 && typeof from == 'function') {
		callback = from;
		from = '2013-01-01';
		to = firstDayOfYear(false);
	} else if (arguments.length == 2 && typeof to == 'function') {
		from = from;
		to = firstDayOfYear(false);
	} else if (arugments.length == 3) {
		// do nothing
	} else {
		throw new Error("arguments error");
	}
	$.ajax({
		url: "/activties/get_activities",
		type: "get",
		data: {
			from: from,
			to: to
		}
	}).done(function(data) {
		// invoke callback function
		if (callback == null) return;
		callback.call(_this, data);
	}).fail(function() {
		console.log("fail to get activities");
	});
},

preloadNext: function() {
	
}

};
