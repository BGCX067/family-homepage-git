/**
 * @author gu jun
 */

var gallery = {

// use initialize function or just extend?
initialize: function(options) {
	this.options = options;
	this.images = options.images;
	this.controlsLang = options.controlsLang;
	this.wrapperClassName = options.wrapperClassName || "";
	// image, caption, slideshow, thumbstrip will be put in
	this.containerId = options.containerId;
	this.container = document.getElementById(this.containerId);
	
	// default value
	this.width = 700;
	this.heigh = 500;
},

replaceLang: function() {
	var s = this.skin.controls,
		re = /{([^}]+)}/g;
	s = s.replace(/\s/g, ' ');
	var matches = s.match(re),
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


