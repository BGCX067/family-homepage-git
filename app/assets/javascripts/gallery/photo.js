/**
 * @author gu jun
 */

var Photo = function(gallery, options) {
	
	this.gallery = gallery;
	
	this.options = options || {};
	_.extend(this, this.options);
	
	var _this = this,
		// create image holder
		imgWrapper = xx.createElement('div', 
			{
				className: 'gallery-image-wrapper'
			},
			{
				position: 'relative',
				width: this.gallery.width + 'px',
				height: this.gallery.height + 'px'
			},
			this.gallery.container
		),
		// imgDiv = xx.createElement('div',
			// null,
			// {
				// margin: 0,
				// padding: 0,
				// width: this.gallery.width + 'px',
				// height: this.gallery.height + 'px'
			// },
			// imgWrapper
		// ),
		img = xx.createElement('img',
			{
				className: 'gallery-image',
				contextmenu: function() {
					return false;
				}
			},
			{
				display: 'block'
			},
			imgWrapper
		);
	
	// create loading icon
	this.loading = xx.createElement('a', 
		{
			className: 'gallery-loading',
			title: loadingLang.loadingTitle || '',
			innerHTML: loadingLang.loadingText || '',
			href: 'javascript:;'
		}, 
		{
			position: 'absolute',
			top: '-9999px',
			opacity: .75,
			zIndex: 1,
			display: 'block'
		}, 
		imgWrapper
	);
	
	this.loadingPos = (function loadingPos() {
		var holder = xx.getElementByClass(document, 'div', 'gallery-image-wrapper'),
			loading = xx.getElementByClass(holder, 'a', 'gallery-loading'),
			lw = loading.offsetWidth,
			lh = loading.offsetHeight,
			hw = holder.offsetWidth,
			hh = holder.offsetHeight;
		return {
			x: (hw - lw) / 2,
			y: (hh - lh) / 2
		};
	})();
	
	this.imgWrapper = function() {
		return xx.getElementByClass(document, 'div', 'gallery-image-wrapper');
	};
	
	this.content = function() {
		var holder = xx.getElementByClass(document, 'div', 'gallery-image-wrapper'),
			img = xx.getElementByClass(holder, 'img', 'gallery-image');
		return img;
	};
};

Photo.prototype = {

onLoadStarted: false,

clone: function(from) {
	var to = from.cloneNode(true);
	to.width = from.width;
	to.height = from.height;
	return to;
},

contentLoaded: function() {
	var content = this.content();
	if (!content) {
		return;
	}
	content.onload = null;
	if (this.onLoadStarted) {
		return;
	} else {
		this.onLoadStarted = true;
	}
	if (this.isLoading) {
		this.isLoading = false;
		this.loading.style.top = '-9999px';
	}
	
	this.justify(content);
	
	// this.current = content.cloneNode(true);
	this.current = this.clone(content);
	
	// make invisible
	xx.setStyles(content, {visibility: 'hidden'});
	xx.setStyles(content, {display: 'none'});
	
	// transition here
	this.doTransition(this.last, this.current);
	
	// visible now
	xx.setStyles(content, {visibility: 'visible'});
	xx.setStyles(content, {display: 'block'});

	// TODO: 
	this.onLoadStarted = false;
},

justify: function(el) {
	function natural(el) {
		var nw, nh;
		if (el.naturalWidth && el.naturalHeight) {
			nw = el.naturalWidth;
			nh = el.naturalHeight;
		} else {
			var img = new Image();
			img.src = el.src;
			nw = img.width;
			nh = img.height;
		}
		return {
			width: nw,
			height: nh
		};
	}
	
	var naturalDem = natural(el),
		naturalWidth = naturalDem.width,
		naturalHeight = naturalDem.height,
		ratio = naturalWidth / naturalHeight,
		isOverflow = naturalWidth > this.gallery.width || naturalHeight > this.gallery.height,
		isWider = ratio > this.gallery.ratio ? true : false,
		styleOpt;
	if (isOverflow) {
		if (isWider) {
			styleOpt = { 
				width: this.gallery.width + 'px',
				'margin-left': -1 * this.gallery.width / 2 + 'px',
				'margin-top': -1 * naturalHeight / 2 + 'px'
			};
		} else {
			styleOpt = {
				height: this.gallery.height + 'px',
				'margin-left': -1 * naturalWidth / 2 + 'px',
				'margin-top': -1 * this.gallery.height / 2 + 'px'
			};
		}
	} else {
		styleOpt = {
			'margin-left': -1 * naturalWidth / 2 + 'px',
			'margin-top': -1 * naturalHeight / 2 + 'px'
		};
	}
	xx.setStyles(el, styleOpt);
},

showLoading: function() {
	if (this.onLoadStarted || this.isLoading) return;
	
	this.isLoading = true;
	
	this.loading.onclick = function() {
		this.cancelLoading();
	};
	
	var _this = this;
	setTimeout(function() {
		if (_this.isLoading) {
			xx.setStyles(_this.loading, {
				left: _this.loadingPos.x,
				top: _this.loadingPos.y,
				zIndex: 1,
				visibility: 'visible'
			});
		}
	}, 100);
},

cancelLoading: function() {
	this.isLoading = false;
	this.loading.style.top = '-9999px';
	// FIXME: cancel image loading
	this.onLoadStarted = false;
},

nextPhoto: function() {
	
},

preloadPhoto: function() {
	
},

preloadNext: function(src) {
	if (src) {	
		xx.createElement('img', { src: src });
	}
},

transit: function(src, nextSrc) {
	var _this = this;
	var content = this.content();
	content.onload = function() {
		_this.contentLoaded();
		_this.preloadNext(nextSrc);
	};
	// this.last = content.cloneNode(true);
	this.last = this.clone(content);
	content.src = src;
	this.showLoading();
},
	
};

// transitions
_.extend(Photo.prototype, {

transitions: ['crossfade'],

doTransition: function(from, to) {
	if (from.src == "") {
		return;
	}
	var trans = this.chooseTransition();
	trans.apply(this, [from, to]);
},

chooseTransition: function() {
	var len = this.transitions.length,
		i = Math.floor(Math.random() * len);
	return this[this.transitions[i]];
},

crossfade: function(from, to) {
	var _this = this,
		imgWrapper = _this.imgWrapper(),
		box = xx.createElement('div', {
			className: 'gallery-fadebox'
		}, {
			position: 'absolute',
			overflow: 'hidden',
			width: '100%',
			height: '100%',
			zIndex: 100
		}, imgWrapper, true);
		
	box.appendChild(this.last);
	box.appendChild(this.current);
	this.current.style.opacity = 0;
	
	this.justify(this.last);
	this.justify(this.current);
	
	function step() {
		
	}
	
	function complete() {
		imgWrapper.removeChild(box);
	}
}

});
