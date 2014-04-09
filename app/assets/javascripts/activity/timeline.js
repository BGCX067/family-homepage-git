/**
 * @author gu jun
 */

var timeline = {
	
initialize: function() {
	
	// http://stackoverflow.com/questions/2465158/is-it-possible-to-remove-inline-styles-with-jquery
	jQuery.fn.removeInlineCss = function(property){
	    if(property == null)
			return this.removeAttr('style');
	    var proporties = property.split(/\s+/);
	    return this.each(function(){
	        var remover = 
	            this.style.removeProperty   // modern browser
	            || this.style.removeAttribute   // old browser (ie 6-8)
	            || jQuery.noop;  //eventual
	        for(var i = 0 ; i < proporties.length ; i++)
	            remover.call(this.style,proporties[i]); 
	    });
	};
	
	this.maxThumbs = 3;
	
	this.registerYearClick();
	
	this.initOnload();
},

initOnload: function() {
	// get this years data when page is ready
	// var from = this.firstDayOfYear(true),
		// to = this.firstDayOfYear(false);
	// this.getActivities(this.genYearTimeline);
	
	$('.activity-year > .activity-tag-header').first().trigger('click');
},

};

/*****************************
 * HTML generatation
 *****************************/
_.extend(timeline, {

// generate html for one year	
genYearTimeline: function(data, container) {
	// processing data
	// actually we only fetch data within one year
	// var year_group = _.groupBy(data.activities, 'year');
	var _this = this,
		monthGroup = _.groupBy(data.activities, 'month'),
		monthKeys = _.sortBy(_.keys(monthGroup), function(num) { return -num; });
	this.userId = data.userId;
	// $(container).removeClass('activity-tag-collapsed').addClass('activity-tag-expanded');
	_.each(monthKeys, function(mkey) {
		var dayGroup = monthGroup[mkey],
			monthDiv = xx.createElement('div', {
				className: 'activity-tag activity-month activity-tag-expanded'
			}, null, container),
			monthHeader = xx.createElement('div', {
				className: 'activity-tag-header',
				innerHTML: '<h3>'+mkey+lang.monthHeader+'</h3><span class="rightward-arrow"></span>'
			}, null, monthDiv),
			monthContent = xx.createElement('div', {
				className: 'activity-tag-content',
				innerHTML: '<p>'+lang.monthContent.replace(/%{count}/, dayGroup.length)+'</p>'+
					'<div class="activity-tag-indicator"><div class="activity-tag-indicator-circle"></div>'+
						'<div class="activity-tag-indicator-line"></div></div>'
			}, {
				opacity: 0
			}, monthDiv);
		monthDiv.setAttribute('data-year', dayGroup[0].year);
		monthDiv.setAttribute('data-month', dayGroup[0].month);
		_this.genMonthTimeline({mkey: dayGroup}, monthDiv);
		$(monthDiv).data('status', 1);
	});
	this.registerMonthClick();
	this.animate($(container), true);
},

// geneate html for one month
genMonthTimeline: function(data, container) {
	var _this = this;
		userId = this.userId,
		month = _.keys(data)[0],
		dayGroup = _.sortBy(data[month], 'day').reverse();
	_.each(dayGroup, function(day) {
		var dayDiv = xx.createElement('div', {
				className: 'activity-tag activity-day activity-tag-expanded'
			}, null, container),
			dayHeader = xx.createElement('div', {
				className: 'activity-tag-header',
				innerHTML: '<h3>'+day.day+lang.dayHeader+'</h3>'
			}, null, dayDiv),
			dayContent = xx.createElement('div', {
				className: 'activity-tag-content'
			}, null, dayDiv),
			dayContentInfoWrapper = xx.createElement('div', {
				className: 'activity-tag-content-info-wrapper'
			}, null, dayContent),
			dayContentTitle = xx.createElement('div', {
				className: 'activity-tag-content-title',
				innerHTML: '<h3 class="activity-title">'+day.title+'</h3>'
			}, null, dayContentInfoWrapper),
			dayContentDesc = xx.createElement('div', {
				className: 'activity-tag-content-desc',
				innerHTML: '<p>'+day.desc+'</p>'
			}, null, dayContentInfoWrapper),
			dayContentPublish = xx.createElement('div', {
				className: 'activity-tag-content-publish',
				innerHTML: '<h3 class="activity-publisher">'+lang.dayContentPublish.replace(/%{username}/, 
						'<span class="activity-publisher-info">'+day.user.relationship+'('+day.user.zh_fullname+')</span>') +'</h3>'
					+ (userId == day.user_id ? '<span class="activity-editor"><a href="/activities/'+day.id+'/edit">'+lang.dayContentEdit+'</a></span>' : '')
			}, null, dayContentInfoWrapper),
			thumbstripLength = (typeof day.photos == 'undefined') ? 0 : Math.min(day.photos.length, _this.maxThumbs),
			thumbstripHTML = (typeof day.photos == 'undefined') ? '' : '<ul>'+_.map(day.photos.slice(0, thumbstripLength), function(ph) {
				return '<li><img src="'+ph.photo.thumb.url+'"></img></li>';
			}).join('')+'</ul>',
			dayContentThumbstrip = xx.createElement('div', {
				className: 'activity-tag-content-thumbstrip',
				innerHTML: thumbstripHTML
			}, null, dayContent),
			dayContentIndicator = xx.createElement('div', {
				className: 'activity-tag-indicator',
				innerHTML: '<div class="activity-tag-indicator-circle"></div><div class="activity-tag-indicator-line"></div>'
			}, null, dayContent);
	});
},

firstDayOfYear: function(flag, year) {
	var year = (year || new Date().getFullYear()) + (flag ? 0 : 1),
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
	if (typeof callback !== 'function') throw new Error("Need a callback function!");
	_.defaults(option, defaultOpt);
	
	$.ajax({
		url: "/get_activities",
		type: "get",
		data: {
			from: option.from,
			to: option.to
		}
	}).done(function(data) {
		if (callback == null) return;
		callback.apply(_this, [data, option.container]);
	}).fail(function() {
		console.log("fail to get activities");
	});
},

preloadNext: function() {
	
}

});

/*****************************
 * Event processing
 *****************************/
_.extend(timeline, {
	
registerYearClick: function() {
	var _this = this;
	$('.activity-year > .activity-tag-header').on('click', function() {
		var tagHeader = $(this),
			tag = tagHeader.parent(),
			status = tag.data('status');
		if (status === 1) { // data already fetched
			// _this.expandOrCollpase(tag);
			_this.animate(tag, tag.hasClass('activity-tag-collapsed'));
			// TODO: animation needed
			return;
		}
		var year = tag.data('year'),
			from = _this.firstDayOfYear(true, year),
			to = _this.firstDayOfYear(false, year);
		tag.data('status', 1);
		_this.getActivities(_this.genYearTimeline, {
			from: from,
			to: to,
			container: tag[0]
		});
	});
},

registerMonthClick: function() {
	var _this = this,
		monthTags = $('.activity-month > .activity-tag-header');
	monthTags.off('click');
	monthTags.on('click', function() {
		var tagHeader = $(this),
			tag = tagHeader.parent(),
			status = tag.data('status');
		if (status === 1) { // data already fetched
			// _this.expandOrCollpase(tag);
			_this.animate(tag, tag.hasClass('activity-tag-collapsed'));
			// TODO: animation needed
			return;
		}
		// TODO: get month activities
		// var year = tag.data('year'),
			// from = _this.firstDayOfYear(true, year),
			// to = _this.firstDayOfYear(false, year);
		// tag.data('status', 1);
		// _this.getActivities(_this.genYearTimeline, {
			// from: from,
			// to: to,
			// container: tag[0]
		// });
	});
},

expandOrCollpase: function(tag) {	
	if (tag == null) tag = this;
	if (!(tag instanceof jQuery)) tag = $(tag);
	if (tag.hasClass('activity-tag-collapsed')) {
		tag.removeClass('activity-tag-collapsed').addClass('activity-tag-expanded');
	} else {
		tag.removeClass('activity-tag-expanded').addClass('activity-tag-collapsed');
	}
},

animate: function(tag, collapsed) {
	if (tag == null) return;
	if (!(tag instanceof jQuery)) tag = $(tag);
	var collapsed = collapsed || false,
		content = tag.children().eq(1),
		height;//,
		// opacity;
	if (collapsed) {
		height = _.reduce(tag.children().slice(1), function(memo, child) {
			return memo + $(child).outerHeight();//attr('offsetHeight');
		}, 5) + 'px'; // margin-bottom: 5px
		// opacity = 1;
	} else {
		height = '29px'; // height: 24px, margin-bottom: 5px
		// opacity = 0;
	}
	tag.animate(
		{
			height: height
			/*, opacity: opacity*/
		}, 
		{
			duration: 400, // the same as the default one
			step: function(now, tween) {
				if (collapsed) {
					content.css('opacity', 1-tween.pos);
				} else {
					content.css('opacity', tween.pos);
				}
			},
			complete: function() {
				var tag = $(this);
				if (collapsed/*tag.hasClass('activity-tag-collapsed')*/) {
					tag.removeClass('activity-tag-collapsed').addClass('activity-tag-expanded');
				} else {
					tag.removeClass('activity-tag-expanded').addClass('activity-tag-collapsed');
				}
				// remove the inline height property
				tag.removeInlineCss('height');
			}
		}
	);
	// tag.children().eq(1).animate({opacity: 1-opacity});
},

});
