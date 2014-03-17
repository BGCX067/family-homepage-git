/**
 * @author gu jun
 */

var Slideshow = function(gallery, options) {
	this.gallery = gallery;
	this.options = options || {};
	_.extend(this, this.options);
	
	if (this.useControls) {
		this.getControls();
	}
	
};

Slideshow.prototype = {
	
getControls: function() {
	// this.controls = xx.createElement(
		// 'div', 
		// { 
			// id: 'slideshow',
			// innerHTML: this.gallery.replaceLang(this.gallery.skin.controls),
		// }, 
		// null, this.gallery.container);
	this.gallery.container.innerHTML += this.gallery.replaceLang(this.gallery.skin.controls);
	this.controls = xx.getElementByClass(this.gallery.container, 'div', 'gallery-controls');
	
	var buttons = ['play', 'pause', 'previous', 'next', 'move', 'full-expand', 'close'];
	this.btn = {};
	var pThis = this;
	for (var i = 0; i < buttons.length; i++) {
		this.btn[buttons[i]] = xx.getElementByClass(this.controls, 'li', 'gallery-'+ buttons[i]);
		this.enable(buttons[i]);
	}
	this.btn.pause.style.display = 'none';
	this.disable('full-expand');
},

checkFirstAndLast: function() {
	if (this.repeat || !this.controls) return;
	var exp = gallery.expanders[this.expKey],
		cur = exp.getAnchorIndex(), 
		re = /disabled$/;
	if (cur == 0) 
		this.disable('previous');
	else if (re.test(this.btn.previous.getElementsByTagName('a')[0].className))
		this.enable('previous');
	if (cur + 1 == gallery.anchors.groups[exp.slideshowGroup || 'none'].length) {
		this.disable('next');
		this.disable('play');
	} else if (re.test(this.btn.next.getElementsByTagName('a')[0].className)) {
		this.enable('next');
		this.enable('play');
	}
},

enable: function(btn) {
	if (!this.btn) return;
	var sls = this, a = this.btn[btn].getElementsByTagName('a')[0], re = /disabled$/;
	a.onclick = function() {
		sls[btn]();
		return false;
	};
	if (re.test(a.className)) a.className = a.className.replace(re, '');
},

disable: function(btn) {
	if (!this.btn) return;
	var a = this.btn[btn].getElementsByTagName('a')[0];
	a.onclick = function() { return false; };
	if (!/disabled$/.test(a.className)) a.className += ' disabled';
},

hitSpace: function() {
	if (this.autoplay) this.pause();
	else this.play();
},

play: function(wait) {
	if (this.btn) {
		this.btn.play.style.display = 'none';
		this.btn.pause.style.display = '';
	}
	
	this.autoplay = true;	
	if (!wait) gallery.next();
},

pause: function() {
	if (this.btn) {
		this.btn.pause.style.display = 'none';
		this.btn.play.style.display = '';
	}
	
	clearTimeout(this.autoplay);
	this.autoplay = null;
},

previous: function() {
	this.pause();
	this.gallery.previous(this.btn.previous);
},

next: function() {
	this.pause();
	this.gallery.next(this.btn.next);
},

move: function() {},

'full-expand': function() {},

close: function() {}

};
