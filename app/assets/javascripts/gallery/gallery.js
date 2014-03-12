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
	this.wrapperClassName = options.wrapperClassName || '';
	// image, caption, slideshow, thumbstrip will be put in
	this.containerId = options.containerId || 'gallery';
	this.container = document.getElementById(this.containerId);
	
	// default value
	this.width = 700;
	this.heigh = 500;
	
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

_.extend(gallery, {
	previous: function() {
		
	},
	
	next: function() {
		
	}
});


