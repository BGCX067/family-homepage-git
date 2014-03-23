/**
 * @author gu jun
 */

var Photo = function(gallery, options) {
	
	this.gallery = gallery;
	
	this.options = options || {};
	_.extend(this, this.options);
	
	var _this = this,
		// create image wrapper
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
		),
		caption = xx.createElement('div', 
			{
				className: 'gallery-caption'
			},
			{
				position: 'absolute',
				top: '100%',
				left: 0,
				'padding-left': '10px',
				height: '20px',
				overflow: 'hidden'
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
	
	this.caption = function() {
		return xx.getElementByClass(document, 'div', 'gallery-caption');
	};
};

Photo.prototype = {

onLoadStarted: false,

contentLoaded: function() {
	if (!this.current) {
		return;
	}
	this.current.onload = null;
	if (this.onLoadStarted) {
		return;
	} else {
		this.onLoadStarted = true;
	}
	if (this.isLoading) {
		this.isLoading = false;
		this.loading.style.top = '-9999px';
	}

	this.doTransition(this.last, this.current);
},

afterContentLoaded: function() {
	var content = this.content(),
		parent = content.parentNode,
		caption = this.caption();
		
	parent.removeChild(content);
	parent.appendChild(this.current);
	
	this.current.style.opacity = 1;
	this.justify(this.current);
	
	this.current.onclick = function() {
		window.location = this.src;
	};
	caption.innerHTML = this.getCaption(this.curImg);
	
	this.onLoadStarted = false;
	
	this.gallery.preventTransition = false;
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

getCaption: function(image) {
	if (image == null) return '<p/>';
	var images = this.gallery.images,
		len = images.length,
		index = _.indexOf(images, image),
		indexStr = (index + 1) + ' / ' + len,
		caption = "<p class='gallery-caption-title'><span class='gallery-caption-index'>" + 
			indexStr + "</span>" + image.title + "</p>";
	return caption;
},

/* this happens after thumbstrip selection */
transit: function(cur, next) {
	var _this = this,
		content = this.content();
		
	this.last = content.cloneNode(true);
	// create a new img element instead of changing it directly
	this.current = content.cloneNode(true);
	this.current.src = cur.src;
		
	// this.preImg = this.curImg;
	this.curImg = cur;
	
	// make sure all images are ready
	var imgs = [this.last, this.current];
		count = _.filter(imgs, function(img) {
			return !img.complete;
		}).length,
		ready = _.after(count, function() {
			_this.contentLoaded();
			if (next && next.src) _this.preloadNext(next.src);
		});
	_.each(imgs, function(img) {
		img.onload = ready;
	});
	
	this.showLoading();
},
	
};

// transitions
_.extend(Photo.prototype, {

transitions: ['crossfade'],

doTransition: function(from, to) {
	if (from.src == "") {
		this.afterContentLoaded();
		return;
	}
	var trans = this.chooseTransition();
	trans.apply(this, [from, to]);
},

scrollBoxTransition: function() {
	// caption transition, downward replace
	var _this = this;
		caption = this.caption(),
		scrollBox = xx.createElement('div', {
			className: 'gallery-scrollbox'
		}, {
			position: 'absolute',
			'padding-left': caption.style['padding-left'],
			left: 0,
			bottom: 0
		}, caption),
		orgCap = xx.getElementByClass(caption, 'p', 'gallery-caption-title'),
		lastCap = orgCap.cloneNode(true),
		curCapHTML = this.getCaption(this.curImg);
	scrollBox.innerHTML = this.getCaption(this.curImg);
	scrollBox.appendChild(lastCap);
	var sbHeight = scrollBox.offsetHeight,
		capHeight = caption.offsetHeight,
		delta = capHeight - sbHeight;
	return {
		step: function(val, opt) {
			var pos = opt.pos,
				unit = opt.unit,
				bottom = delta * pos;
			scrollBox.style.bottom = bottom + unit;
			orgCap.style.visibility = 'hidden';
		},
		complete: function() {
			orgCap.innerHTML = curCapHTML;
		}
	};
},

chooseTransition: function() {
	var len = this.transitions.length,
		i = Math.floor(Math.random() * len);
	return this[this.transitions[i]];
},

crossfade: function(from, to) {
	var _this = this,
		imgWrapper = _this.imgWrapper(),
		w = styleValue(imgWrapper, 'width', true),
		h = styleValue(imgWrapper, 'height', true),
		box = xx.createElement('div', {
			className: 'gallery-fadebox'
		}, {
			position: 'absolute',
			overflow: 'hidden',
			left: 0,
			top: 0,
			width: w,
			height: h,
			zIndex: 100
		}, imgWrapper, true),
		content = this.content(),
		scrollBoxTrans = this.scrollBoxTransition(),
		lastValue;
	
	function styleValue(el, prop, inPx) {
		if (el.style && el.style[prop] != null && el.style[prop] != '') {
			var rtn = el.style[prop];
			return inPx ? (/px$/.test(rtn) ? rtn : rtn + 'px') : (/px$/.test(rtn) ? rtn.substr(0, rtn.length - 2) : rtn);
		} else {
			return inPx ? el[prop] + 'px' : el[prop];
		}
	}
		
	box.appendChild(this.last);
	box.appendChild(this.current);
	
	this.justify(this.last);
	this.justify(this.current);
	
	// make invisible
	xx.setStyles(content, {visibility: 'hidden'});
	xx.setStyles(content, {display: 'none'});
	
	this.current.style.opacity = 0;
	
	var hDelta = (styleValue(this.last, 'height') - styleValue(this.current, 'height')) / 2,
		wDelta = (styleValue(this.last, 'width') - styleValue(this.current, 'width')) / 2,
		orgTop = this.last.offsetTop,
		orgRight = this.last.offsetLeft + this.last.offsetWidth, // offsetWidth == styleValue()
		orgBottom = this.last.offsetTop + this.last.offsetHeight,
		orgLeft = this.last.offsetLeft;
	
	// animate on a dummy div with our customized step and complete function
	var dummy = document.createElement('div');
	dummy.style.width = 0;
	xx.animate(dummy, {width: 100}, {
		duration: this.transitionDuration || 250,
		step: step,
		complete: complete
	});
	
	function step(val, opt) {
		var pos = opt.pos,
			unit = opt.unit,
			inversePos = 1 - pos,
			top = Math.round(orgTop + hDelta * pos),
			right = Math.round(orgRight - wDelta * pos),
			bottom = Math.round(orgBottom - hDelta * pos),
			left = Math.round(orgLeft + wDelta * pos);
			
		// no need for `,' on IE8 or earlier. I think so, but maybe not.
		box.style.clip = 'rect(' + top + unit + ',' + right + unit + ',' + bottom + unit + ',' + left + unit + ')';
		_this.last.style.opacity = inversePos;
		_this.current.style.opacity = pos;
		
		if (scrollBoxTrans.step) scrollBoxTrans.step.apply(_this, [val, opt]);
	}
	
	function complete() {
		imgWrapper.removeChild(box);
		_this.afterContentLoaded();
		
		if (scrollBoxTrans.complete) scrollBoxTrans.complete.apply(_this);
	}
}

});
