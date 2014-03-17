/**
 * This animation code is borrowed from highslide.
 * 
 * @author gu jun
 */

var Animation = function(elem, options, prop) {
	this.options = options;
	this.elem = elem;
	this.prop = prop;
};

Animation.prototype = {
	timers: [],
	// timerId: undefined,
	
	update: function(){
		(this.step[this.prop] || this.step._default)(this);
		
		if (this.options.step)
			this.options.step.call(this.elem, this.now, this);

	},
	custom: function(from, to, unit){
		this.startTime = (new Date()).getTime();
		this.start = from;
		this.end = to;
		this.unit = unit;
		this.now = this.start;
		this.pos = this.state = 0;

		var _this = this;
		function t(gotoEnd){
			return _this.step(gotoEnd);
		}

		t.elem = this.elem;

		// make sure only one timer is running
		// The minimum is 4ms (as of HTML5) in modern browser, prior to that, it was 10ms.
		// But it's not 100% accurate.
		if ( t() && this.timers.push(t) == 1 ) {
			var timerId = setInterval(function(){
				var timers = _this.timers;

				for ( var i = 0; i < timers.length; i++ )
					if ( !timers[i]() )
						timers.splice(i--, 1);

				if ( !timers.length ) {
					clearInterval(timerId);
				}
			}, 13); 
		}
	},
	step: function(gotoEnd){
		var t = (new Date()).getTime();
		if ( gotoEnd || t >= this.options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			this.options.curAnim[ this.prop ] = true;

			var done = true;
			for ( var i in this.options.curAnim )
				if ( this.options.curAnim[i] !== true )
					done = false;

			if ( done ) {
				if (this.options.complete) this.options.complete.call(this.elem);
			}
			return false;
		} else {
			var n = t - this.startTime;
			this.state = n / this.options.duration;
			this.pos = this.options.easing(n, 0, 1, this.options.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);
			this.update();
		}
		return true;
	}

};


_.extend(Animation.prototype.step, {
	opacity: function(fx){
		xx.setStyles(fx.elem, { opacity: fx.now });
	},

	_default: function(fx){
		try {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null )
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			else
				fx.elem[ fx.prop ] = fx.now;
		} catch (e) {}
	}
});

