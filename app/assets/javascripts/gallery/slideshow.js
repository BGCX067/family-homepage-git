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
	
	if (this.repeat == undefined) {
		this.repeat = true;
	}
	
};

Slideshow.prototype = {
	
getControls: function() {
	this.gallery.container.innerHTML += this.gallery.replaceLang(this.gallery.skin.controls);
	this.controls = xx.getElementByClass(this.gallery.container, 'div', 'gallery-controls');
	
	var buttons = ['play', 'pause', 'previous', 'next', 'move', 'full-expand', 'close'];
	this.btn = {};
	for (var i = 0; i < buttons.length; i++) {
		this.btn[buttons[i]] = xx.getElementByClass(this.controls, 'li', 'gallery-'+ buttons[i]);
		this.enable(buttons[i]);
	}
	this.btn.pause.style.display = 'none';
	this.disable('full-expand');
},

checkFirstAndLast: function() {
	if (this.repeat || !this.controls) return;
	var cur = this.gallery.anchorIndex(),
		re = /disabled$/;
	if (cur == 0) 
		this.disable('previous');
	else if (re.test(this.btn.previous.getElementsByTagName('a')[0].className))
		this.enable('previous');
	if (cur + 1 == this.gallery.images.length) {
		this.disable('next');
		this.disable('play');
	} else if (re.test(this.btn.next.getElementsByTagName('a')[0].className)) {
		this.enable('next');
		this.enable('play');
	}
},

enable: function(btn) {
	if (!this.btn) return;
	var sls = this,
		a = this.btn[btn].getElementsByTagName('a')[0],
		re = /disabled$/;
	a.onclick = function() {
		sls[btn]();
		return false;
	};
	if (re.test(a.className)) {
		a.className = a.className.replace(re, '');
	}
},

disable: function(btn) {
	if (!this.btn) {
		return;
	}
	var a = this.btn[btn].getElementsByTagName('a')[0];
	a.onclick = function() { 
		return false;
	};
	if (!/disabled$/.test(a.className)) {
		a.className += ' disabled';
	}
},

hitSpace: function() {
	if (this.autoplay) {
		this.pause();
	} else {
		this.play();
	}
},

play: function(wait) {
	if (this.btn) {
		this.btn.play.style.display = 'none';
		this.btn.pause.style.display = '';
	}
	
	if (!wait) {
		var interval = this.slideshowDuration || 5000,
			_this = this;
		this.autoplay = setTimeout(function() {
			if (!_this.repeat && _this.gallery.anchorIndex() == _this.gallery.images.length - 1) {
				_this.pause();
				return;
			}
			_this.gallery.selectNeighborThumb(1);
			_this.autoplay = setTimeout(arguments.callee, interval);
		}, interval);
	}
},

pause: function() {
	if (this.btn) {
		this.btn.pause.style.display = 'none';
		this.btn.play.style.display = '';
	}
	
	if (this.autoplay) {
		clearTimeout(this.autoplay);
		this.autoplay = null;
	}
},

previous: function() {
	this.pause();
	this.gallery.selectNeighborThumb(-1);
},

next: function() {
	this.pause();
	this.gallery.selectNeighborThumb(1);
},

move: function() {},

'full-expand': function() {},

close: function() {}

};
