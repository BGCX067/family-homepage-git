/**
 * @author gu jun
 */

/**
 * 
 * @param {Object} options
 * 	[gallery, width, position, offsetY] is necessary
 */
// function ThumbstripBase(options) {
	// this.options = options;
	// this.gallery = options.gallery;
// 	
	// this.images = this.gallery.images;
// 	
	// this.mode = options.mode || "horizontal"; // do not support other mode :D
	// // if (options.scroll == undefined) {
		// // this.scroll = true;
	// // } else {
		// // this.scroll = options.scroll;
	// // }
	// this.width = options.width;
	// this.position = options.position;
	// this.offsetY = options.offsetY;
// }

function Thumbstrip(gallery, options) {
	
	this.options = options;
	// this.gallery = options.gallery;
	// this.images = this.gallery.images;
	this.mode = options.mode || 'horizontal'; // do not support other mode :D
	this.width = options.width;
	this.position = options.position || '';
	this.offsetY = options.offsetY;
	
	this.gallery = gallery;
	
	this.anchors = []; // hold anchors created
	this.curAnchor = null;
	
	var _this = this;
	
	function getIndex() {
		if (_this.curAnchor == null) {
			return -1;
		}
		return _.indexOf(_this.anchors, _this.curAnchor);
	}
	
	function scroll(delta) {
		selectThumb(undefined, Math.round(delta * dom['offsetWidth'] * 0.7));
	};
	
	function selectPreOrNextThumb(dir) {
		var i = getIndex();
		if (i == -1) return;
		
		var len = _this.anchors.length,
			sign = dir / Math.abs(dir); // in case dir is not [-1, 1]
		i = (i + sign + len) % len;
		selectThumb(i);
	};
	
	// function select(i, scrollby, dir) {
		// var i = getIndex();
		// if (i == -1) return;
		// var len = _this.anchors.length,
			// sign;
		// if (dir == 0) {
			// sign = 0;
		// } else {
			// sign = dir / Math.abs(dir);
		// }
		// i = (i + sign + len) % len;
		// selectThumb(i, scrollby);
	// };
	
	function selectThumb(i, scrollBy) {
		if (_this.gallery.preventTransition) {
			return false;
		} else {
			_this.gallery.preventTransition = true;
		}
		
		if (i === undefined && (i = getIndex()) == -1) return;

		var as = dom.getElementsByTagName('a'),
			active = as[i],
			cell = active.parentNode,
			// if vertical mode, we should use 'Top', 'Bottom', 'Height'
			left = 'Left',
			right = 'Right',
			width = 'Width',
			offsetLeft = 'offset' + left,
			offsetWidth = 'offset' + width,
			// overlayWidth = div.parentNode.parentNode[offsetWidth],
			overlayWidth = dom.offsetWidth,
			minTblPos = overlayWidth - table[offsetWidth],
			curTblPos = parseInt(table.style['left']) || 0,
			tblPos = curTblPos,
			mgnRight = 20;
		this.curAnchor = active;
		if (scrollBy !== undefined) {
			tblPos = curTblPos - scrollBy;
			
			if (minTblPos > 0) minTblPos = 0;
			if (tblPos > 0) tblPos = 0;
			if (tblPos < minTblPos) tblPos = minTblPos;
		} else {
			_.each(as, function(a, index) {
				a.className = '';
			});
			active.className = 'gallery-active-anchor';
			var activeLeft = i > 0 ? as[i - 1].parentNode[offsetLeft] : cell[offsetLeft],
				activeRight = cell[offsetLeft] + cell[offsetWidth] + 
					(as[i + 1] ? as[i + 1].parentNode[offsetWidth] : 0);
			if (activeRight > overlayWidth - curTblPos) tblPos = overlayWidth - activeRight;
			else if (activeLeft < -curTblPos) tblPos = -activeLeft;
			
			// when select thumb directly, we need to perform photo transition
			// var next = (i + 1) == _this.gallery.images.length ? null : _this.gallery.images[i + 1].src;
			var len = _this.gallery.images.length,
				next = _this.gallery.images[(i + 1) % len];
			_this.gallery.transit(_this.gallery.images[i], next);
			
			_this.gallery.checkFirstAndLast();
		}
		var markerPos = cell[offsetLeft] + (cell[offsetWidth] - marker[offsetWidth]) / 2 + tblPos;
		xx.animate(table, { left: tblPos }, null, 'easeOutQuad');
		xx.animate(marker,{ left: markerPos }, null, 'easeOutQuad', function() {
			if (scrollBy !== undefined) _this.gallery.preventTransition = false;
		});
		scrollUp.style.display = tblPos < 0 ? 'block' : 'none';
		scrollDown.style.display = (tblPos > minTblPos)  ? 'block' : 'none';
	};
		
	var mode = options.mode || 'horizontal',
		tree = ['table', 'tbody', 'tr', 'td'],
		dom = xx.createElement('div', {
				id: 'thumbstrip',
				className: 'gallery-thumbstrip gallery-thumbstrip-'+ mode,
				innerHTML:
					'<div class="gallery-thumbstrip">'+
					'<'+ tree[0] +'><'+ tree[1] +'></'+ tree[1] +'></'+ tree[0] +'></div>'+
					'<div class="gallery-scroll-up"><div></div></div>'+
					'<div class="gallery-scroll-down"><div></div></div>'+
					'<div class="gallery-marker"><div></div></div>'
			}, {
				display: 'block'
			}, this.gallery.container),
		domCh = dom.childNodes,
		div = domCh[0],
		scrollUp = domCh[1],
		scrollDown = domCh[2],
		marker = domCh[3],
		table = div.firstChild,
		tbody = table.firstChild,
		tr;

	_.each(this.gallery.images, function(image, index, images) {
		if (index == 0) {
			tr = xx.createElement(tree[2], null, null, tbody);
		}
		(function(thumbstrip) {
			var cell = xx.createElement(tree[3], null, null, tr),
				attrs = {
					href: image.src,
					title: image.title,
					onclick: function() {
						if (/gallery-active-anchor/.test(this.className)) {
							return false;
						}
						if (selectThumb(index) == false) {
							return false;
						}
						// call delegate methods
						thumbstrip.gallery.pause();
						return false;
					},
					innerHTML: "<img src='" + image.thumbSrc + "'>"
				};
			thumbstrip.anchors[index] = xx.createElement('a', attrs, null, cell);
		})(this);
	}, this);
	
	scrollUp.onclick = function () { scroll(-1); };
	scrollDown.onclick = function() { scroll(1); };
	
	// we need to fire this event when all thumbnails have been loaded
	// don't know why 'load' event does not work
	(function() {
		var imgs = $("#thumbstrip img");
		var count = imgs.length;
		
		imgs.load(function() {
		    count--;
		    if (!count) {
		    	_this.anchors[0].onclick();
		    }
		}).filter(function() { return this.complete; }).load();
	})();
	
	return {
		selectPreOrNextThumb: selectPreOrNextThumb,
		selectThumb: selectThumb,
		anchorIndex: getIndex
	};
}
