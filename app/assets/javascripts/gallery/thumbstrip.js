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
			
	// ThumbstripBase.call(this);
	
	this.options = options;
	// this.gallery = options.gallery;
	// this.images = this.gallery.images;
	this.mode = options.mode || "horizontal"; // do not support other mode :D
	this.width = options.width;
	this.position = options.position;
	this.offsetY = options.offsetY;
	
	this.gallery = gallery;
	
	this.anchors = []; // hold anchors created
	this.curAnchor = null;
	
	var _this = this;
	
	function getIndex() {
		if (_this.curAnchor == null) {
			return -1;
		}
		return _.indexOf(_this.anchors, this.curAnchor);
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
	
	function select(i, scrollby, dir) {
		var i = getIndex();
		if (i == -1) return;
		var len = _this.anchors.length,
			sign;
		if (dir == 0) {
			sign = 0;
		} else {
			sign = dir / Math.abs(dir);
		}
		i = (i + sign + len) % len;
		selectThumb(i, scrollby);
	};
	
	function selectThumb(i, scrollBy) {
		// if (i === undefined) {
			// if (_this.curAnchor == null) {
				// return;
			// }
			// i = _.indexOf(_this.anchors, this.curAnchor);
		// }
		// if (i == -1) return;
		if (i === undefined || getIndex() == -1) return;

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
			overlayWidth = 600; // hard coded for now
			minTblPos = overlayWidth - table[offsetWidth],
			curTblPos = parseInt(table.style['left']) || 0,
			tblPos = curTblPos,
			mgnRight = 20;
		if (scrollBy !== undefined) {
			tblPos = curTblPos - scrollBy;
			
			if (minTblPos > 0) minTblPos = 0;
			if (tblPos > 0) tblPos = 0;
			if (tblPos < minTblPos) tblPos = minTblPos;
		} else {
			_.each(as, function(a, index) {
				a.className = '';
			});
			// active.className = 'highslide-active-anchor'; //TODO:
			var activeLeft = i > 0 ? as[i - 1].parentNode[offsetLeft] : cell[offsetLeft],
				activeRight = cell[offsetLeft] + cell[offsetWidth] + 
					(as[i + 1] ? as[i + 1].parentNode[offsetWidth] : 0);
			if (activeRight > overlayWidth - curTblPos) tblPos = overlayWidth - activeRight;
			else if (activeLeft < -curTblPos) tblPos = -activeLeft;
		}
		var markerPos = cell[offsetLeft] + (cell[offsetWidth] - marker[offsetWidth]) / 2 + tblPos;
		xx.animate(table, { left: tblPos }, null, 'easeOutQuad');
		xx.animate(marker,{ left: markerPos }, null, 'easeOutQuad');
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
				display: 'none'
			}, this.gallery.container),
		domCh = dom.childNodes,
		div = domCh[0],
		scrollUp = domCh[1],
		scrollDown = domCh[2],
		marker = domCh[3],
		table = div.firstChild,
		tbody = table.firstChild,
		tr;
		
	_.each(this.gallery.images, function(image, index) {
		if (index == 0) {
			tr = xx.createElement(tree[2], null, null, tbody);
		}
		(function(thumbstrip) {
			var cell = xx.createElement(tree[3], null, null, tr),
				attrs = {
					href: image.src,
					title: image.title,
					onclick: function() {
						// TODO: fill this in
						// if (/highslide-active-anchor/.test(this.className)) return false;
						// this.gallery.getExpander(this).focus();
						// return this.gallery.transit(a);
					},
					innerHTML: "<img src='" + image.thumbSrc + "'>"
				};
			// if (index == 0) {
				// attrs.id = "thumb1"; // we can get reference easy with an id
			// }
			thumbstrip.anchors[index] = xx.createElement('a', attrs, null, cell);
		})(this);
	}, this);
	
	scrollUp.onclick = function () { scroll(-1); };
	scrollDown.onclick = function() { scroll(1); };
	
	// return {
		// select: select
	// };
}

// function extendBase(ctor, base) {
	// ctor.prototype = new base();
	// ctor.prototype.constructor = ctor;
// }
// 
// extendBase(Thumbstrip, ThumbstripBase);
