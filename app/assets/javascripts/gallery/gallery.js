/**
 * @author gu jun
 */

var gallery = {
	
skin: {
	controls:
		'<div class="gallery-controls"><ul>'+
			'<li class="gallery-previous">'+
				'<a href="#" title="{previousTitle}">'+
				'<span>{previousText}</span></a>'+
			'</li>'+
			'<li class="gallery-play">'+
				'<a href="#" title="{playTitle}">'+
				'<span>{playText}</span></a>'+
			'</li>'+
			'<li class="gallery-pause">'+
				'<a href="#" title="{pauseTitle}">'+
				'<span>{pauseText}</span></a>'+
			'</li>'+
			'<li class="gallery-next">'+
				'<a href="#" title="{nextTitle}">'+
				'<span>{nextText}</span></a>'+
			'</li>'+
			'<li class="gallery-move">'+
				'<a href="#" title="{moveTitle}">'+
				'<span>{moveText}</span></a>'+
			'</li>'+
			'<li class="gallery-full-expand">'+
				'<a href="#" title="{fullExpandTitle}">'+
				'<span>{fullExpandText}</span></a>'+
			'</li>'+
			'<li class="gallery-close">'+
				'<a href="#" title="{closeTitle}" >'+
				'<span>{closeText}</span></a>'+
			'</li>'+
		'</ul></div>'
},

// use initialize function or just extend?
initialize: function(options) {
	this.options = options;
	this.images = options.images;
	this.controlsLang = options.controlsLang || controlsLang;
	this.wrapperClassName = options.wrapperClassName || "in-page";
	// image, caption, slideshow, thumbstrip will be put in
	this.containerId = options.containerId || 'gallery';
	this.container = document.getElementById(this.containerId);
	
	// default value
	this.ratio = 3/2;
	this.width = 700;
	this.height = Math.floor(this.width / this.ratio);
	
	// http://www.robertpenner.com/easing/ 
	Math.linearTween = function (t, b, c, d) {
		return c*t/d + b;
	};
	Math.easeInQuad = function (t, b, c, d) {
		return c*(t/=d)*t + b;
	};
	Math.easeOutQuad = function (t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	};
	
	this.initComponents();
},

initComponents: function() {
	// add photo TODO:
	this.photo = new Photo(this, {});
	
	// add caption
	
	// add slideshow TODO:
	this.slideshow = new Slideshow(this, {useControls: true});
	
	// add thumbstrip TODO:
	this.thumbstrip = Thumbstrip(this, {
		width: 700,
		position: 'bottom right',
		offsetY: 20
	});
},

replaceLang: function(s) {
	var s = s.replace(/\s/g, ' '),
		re = /{([^}]+)}/g,
		matches = s.match(re),
		lang;
	_.each(matches, function(match, index) {
		lang = match.replace(re, "$1");
		if (typeof this.controlsLang[lang] != 'undefined') {
			s = s.replace(match, this.controlsLang[lang]);
		}
	}, this);
	return s;
}

};

_.extend(gallery, {
	events: {},
	addEventListener: function(name, handler) {
		if (!this.events[name]) {
			this.events[name] = [];
		}
    	this.events[name].push(handler);
	},
	removeEventListener: function(nane, handler) {
		if (!this.events[name]) return;
	    for (var i = this.events[name].length - 1; i >= 0; i--) {
	        if (this.events[name][i] == handler) {
	            this.events[name].splice(i, 1);
	        }
	    }
	},
	raiseEvent: function(name, args) {
	    if (!this.events[name]) return;
	    for (var i = 0; i < this.events[name].length; i++) {
	        this.events[name][i].apply(this, args);
	    }
	}
});

/* delegate photo */
_.extend(gallery, {	
	transit: function(src, nextSrc) {
		this.photo.transit(src, nextSrc);
	}
});

/* delegate thumbstrip */
_.extend(gallery, {
	selectNeighborThumb: function(dir) {
		this.thumbstrip.selectPreOrNextThumb(dir);
	},
	selectThumb: function(i) {
		this.thumbstrip.selectThumb(i);
	}
});

/* preload image */
_.extend(gallery, {
	continePreloading: true,
	preloadImageSize: 5,
	imagesToPreload: [],
	
	preloadFullImage: function(i) {
		if (this.continuePreloading && this.imagesToPreload[i] && hs.imagesToPreload[i] != 'undefined') {
			var img = document.createElement('img');
			img.onload = function() { 
				img = null;
				hs.preloadFullImage(i + 1);
			};
			img.src = hs.imagesToPreload[i];
		}
	},
	
	preloadImages: function(number) {
		if (number === undefined) {
			number = this.preloadImageSize;
		}
		var n = Math.max(number, this.images.length),
			i;
		for (i = 0; i < n; i++) {
			xx.push(this.imagesToPreload, this.images[i].src);
		}
		preloadFullImage(0);
	},
	
	preloadThumbImages: function() {
		// TODO: fill in
	}
});


