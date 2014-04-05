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
	this.getActivities(this.genYearTimeline);
},

};

_.extend(timeline, {

// generate html for one year	
genYearTimeline: function(data, container) {
	// processing data
	// actually we only fetch data within one year
	// var year_group = _.groupBy(data.activities, 'year');
	var _this = this,
		monthGroup = _.groupBy(data.activities, 'month'),
		monthKeys = _.sortBy(_.keys(monthGroup), function(num) { return -num; });
	this.user = data.user;
	$(container).removeClass('activity-tag-collapsed').addClass('activity-tag-expanded');
	_.each(monthKeys, function(mkey) {
		var dayGroup = monthGroup[mkey],
			monthDiv = xx.createElement('div', {
				className: 'activitiy-tag activity-month activity-tag-expanded'
			}, null, container),
			monthHeader = xx.createElement('div', {
				className: 'activity-tag-header',
				innerHTML: '<h>'+mkey+lang.monthHeader+'</h>'
			}, null, monthDiv),
			monthContent = xx.createElement('div', {
				className: 'activity-tag-content',
				innerHTML: '<p>'+lang.monthContent.replace(/%{count}/, dayGroup.length)+'</p>'
			}, null, monthDiv);
		_this.genMonthTimeline({mkey: dayGroup}, monthDiv);
	});
},

// geneate html for one month
genMonthTimeline: function(data, container) {
	var userId = this.userId,
		month = _.keys(data)[0],
		dayGroup = _.sortBy(data[month], 'day').reverse();
	_.each(dayGroup, function(day) {
		var dayDiv = xx.createElement('div', {
				className: 'activity-tag activity-day activity-tag-expanded'
			}, null, container),
			dayHeader = xx.createElement('div', {
				className: 'activity-tag-header',
				innerHTML: '<h>'+day.day+lang.dayHeader+'</h>'
			}, null, dayDiv),
			dayContent = xx.createElement('div', {
				className: 'activity-tag-content',
			}, null, dayDiv),
			dayContentTitle = xx.createElement('div', {
				className: 'activity-tag-content-title',
				innerHTML: '<h class="activity-title">'+day.title+'</h>' 
					+ '<h class="activity-publisher">'+lang.dayContentPublish.replace(/%{username}/, 
						'<span class="activity-publisher-info">'+day.user.relationship+':'+day.user.zh_fullname+'</span>')
					+ (userId == day.user_id ? '<span class="activity-editor">'+lang.dayContentEdit+'</span>' : '') +'</h>'
			}, null, dayContent),
			dayContentDesc = xx.createElement('div', {
				className: 'activity-tag-content-desc',
				innertHTML: '<p>'+day.desc+'</p>'
			}, null, dayContent),
			thumbstripLength = (typeof day.photos == 'undefined') ? 0 : Math.min(day.photos.length, 3),
			thumbstripHTML = (typeof day.photos == 'undefined') ? '' : '<ul>'+_.map(day.photos.slice(0, thumbstripLength), function(ph) {
				return '<li><img src="'+ph.photo.thumb.url+'"></img></li>';
			}).join('')+'</ul>',
			dayContentThumbstrip = xx.createElement('div', {
				className: 'activity-tag-content-thumbstrip',
				innerHTML: thumbstripHTML
			}, null, dayContent);
	});
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
			from: this.firstDayOfYear(true), //'2013-01-01',
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
