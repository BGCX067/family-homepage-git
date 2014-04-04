/**
 * @author gu jun
 */

var timeline = {
	
initialize: function() {
	
	this.initOnload();
},

initOnload: function() {
	// get this years data when page is ready
	var from = this.firstDayOfYear(true),
		to = this.firstDayOfYear(false);
	this.getActivities(this.genTimeline);
},

};

_.extend(timeline, {
	
genTimeline: function(data, container) {
	// processing data
	var year_group = _.groupBy(data.activities, 'year');
	
},
	
firstDayOfYear: function(flag) {
	var today = new Date(),
		year = today.getFullYear() + (flag ? 0 : 1),
		firstDay = year.toString() + '-01-01';
	return firstDay;
},

getActivities: function(callback, opt) {
	var _this = this,
		from,
		to,
		defaultOpt = {
			from: '2013-01-01',
			to: this.firstDayOfYear(false),
			container: $(".activity-year")[0]
		},
		option = opt || {};
	if (typeof callback === 'undefined') throw new Error("Need a callback function!");
	_.defaults(option, defaultOpt);
	
	$.ajax({
		url: "/get_activities",
		type: "get",
		data: {
			from: option.from,
			to: option.to
		}
	}).done(function(data) {
		// invoke callback function
		if (callback == null) return;
		callback.apply(_this, [data, option.container]);
	}).fail(function() {
		console.log("fail to get activities");
	});
},

preloadNext: function() {
	
}

});
