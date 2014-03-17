/**
 * @author gu jun
 */

var Photo = function(gallery, options) {
	
	this.gallery = gallery;
	
	this.options = options || {};
	_.extend(this, this.options);
	
	this.tansitions = ['crossfade', 'transition'];
	
	var _this = this,
		// create image holder
		imgHolder = xx.createElement('div', 
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
		imgDiv = xx.createElement('div',
			null,
			{
				margin: 0,
				padding: 0,
				width: this.gallery.width + 'px',
				height: this.gallery.height + 'px'
			},
			imgHolder
		),
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
			imgDiv
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
		imgHolder
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
	
	this.imgHolder = function() {
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
	
	var naturalDem = natural(el);
		naturalWidth = naturalDem.width,
		naturalHeight = naturalDem.height,
		ratio = naturalWidth / naturalHeight;
	// console.log('natural: ', content.naturalWidth, content.naturalHeight, 'not: ', content.width, content.height);
	xx.setStyles(el, {
		width: naturalWidth + 'px',
		height: naturalHeight + 'px'
	});
	if (ratio > this.gallery.ratio) {
		
	}
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
	
	// if (!tgt && this.last && this.transitions[1] == 'crossfade') 
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
	// FIXME:
	// var _this = this;
	// var content = this.content();
	// content.onload = function() {
		// _this.contentLoaded();
		// _this.preloadNext(nextSrc);
	// };
	// content.src = src;
	this.createTranslation(src, nextSrc);
	this.showLoading();
},

translation: function(src, nextSrc) {
	var _this = this,
		div = xx.createElement('div', null, {
			margin: 0,
			padding: 0,
			width: this.gallery.width + 'px',
			height: this.gallery.height + 'px'
		}),
		replacement = xx.createElement('img', {
			className: 'gallery-image',
			contextmenu: function() {
				return false;
			},
			onload: function() {
				_this.replacementLoaded(replacement);
				_this.preloadNext(nextSrc);
			},
			src: src
		}, null, div);
	return replacement;
},

replacementLoaded: function(replacement) {
	if (this.onLoadStarted) {
		return;
	} else {
		this.onLoadStarted = true;
	}
	if (this.isLoading) {
		this.isLoading = false;
		this.loading.style.top = '-9999px';
	}
}
	
};
