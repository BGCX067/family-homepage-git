/**
 * @author gu jun
 */

var Viewer = function(img, target, gallery, opt) {
	if (typeof img === 'undefined' || typeof target === 'undefined' || typeof gallery == 'undefined') 
		throw new Error("Viewer constructor argument error");
	this.img = img;
	this.target = target;
	this.gallery = gallery;
	this.opt = opt || {};
	
	this.width = opt.width || 900;
	this.ratio = opt.ratio || 1.5;
	this.height = this.width / this.ratio;
	
	// do not care about height, even if a vertical scrollbar is necessary
	this.fitPageInWidth();
	
	this.padding = opt.padding || {top: 20, right: 20, bottom: 20, top: 20};
	
	this.container = this.gallery.container;
	
	this.key = this.gallery.viewers.length;
	this.gallery.viewers[this.key] = this;
	
	// all viewer share one viewport
	// TODO: move genViewport() to gallery?
	this.viewport = this.gallery.viewport || this.genViewport();
	if (this.gallery.viewport == null) this.gallery.viewport = this.viewport;

	// add photo
	this.photo = new Photo(this, this.opt.phot || {transitionDuration: 250});
	
	// add slideshow
	this.slideshow = new Slideshow(this, this.opt.slideshow || {useControls: true, repeat: true});
	
	// add thumbstrip
	this.thumbstrip = Thumbstrip(this, this.opt.thumbstrip || {
		width: this.width,
		// position: 'bottom right', // TODO: I'm about to support thumbstrip position in next version
		// offsetY: 20
	});
	
};

Viewer.prototype = {
	
	// prevent other viewer if this value is true
	isRunning: false,
	
	fitPageInWidth: function() {
		var pgSize = this.pageSize();
		if (this.width > pgSize.width) this.width = pgSize.width;
		this.height = this.width / this.ratio;
	},
	
	show: function() {
		
	},
	
	// get the final postion
	finalPos: function() {
		var _this = this;
			pgSize = this.pageSize(),
			wrapper = {
				width: function() {
					if (_this.width > pgSize.width) {
						_this.width = pgSize.width;
					}
					return _this.width;
				}(),
				height: function() {
					_this.height = _this.width / _this.ratio;
					return _this.height;
				}(),
				left: function() {
					return (pgSize.width - _this.width) / 2;
				}(),
				top: function() {
					var h = pgSize.height - _this.height;
					if (h < 0) h = 0;
					return h / 2;
				}()
			},
			// use justify() of Photo to calculate this, left it empty for now
			content = {
			};
		return {
			wrapper: wrapper,
			content: content
		};
	},
	
	// dim the viewport
	dim: function() {
		
	},
	
	pageSize: function() {
		var $win = $(window),
			width = $win.width(),
			height = $win.height(),
			$doc = $(document),
			scrollTop = $doc.scrollTop(),
			scrollLeft = $doc.scrollLeft();
		return {
			width: width,
			height: heigth,
			scrollTop: scrollTop,
			scrollLeft: scrollLeft
		};
	},
	
	genViewport: function() {
		var body = document.getElementsByTagName("body")[0],
			psize = this.pageSize();
		xx.createElement('div', {
			className: 'gallery-viewport'
		}, {
			background: black,
			padding: 0,
			margin: 0,
			visibility: visible,
			opacity: 0,
			display: none
		}, body);
	}
};
