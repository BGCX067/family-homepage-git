function VisEdge(options) {
	
	this.initialize = function(options) {
	    this.tail = null;
	    this.head = null;
	    this.animationSpeed = GRAPHICS.defaultAnimationTime;
	    this.animationEasing = GRAPHICS.defaultEasing;
	    
	    // this.isBesier = false; // besier curve if true, straight line otherwise
	    
	    options = options || {};
	    this.options = options;
	    for (key in options) {
	    	this[key] = options[key];
	    }
	};
	
	this.isAlive = function() {
		return this.tail.alive;
	};

	this.genGraphics = function(paper) {
		var pathString = this.getBezierCurve();

		var path = paper.path(pathString).attr({
			'stroke-width' : 2,
			'stroke' : this.getStrokeColor(),
			'stroke-linecap' : 'round',
			'stroke-linejoin' : 'round',
			'fill' : this.getStrokeColor()
		});
		path.toBack();
		this.path = path;
	};
	
	this.getStrokeColor = function() {
		return '#666';
	};

	this.getAttributes = function() {
		var newPath = this.getBezierCurve();
		var opacity = this.getOpacity();
		return {
			path : {
				path : newPath,
				opacity : opacity
			}
		};
	};
	
	this.getOpacity = function() {
		return 1;
	};

	this.genSmoothBezierPathString = function(tail, head) {
		var tailPos = tail.getScreenCoords();
		var headPos = head.getScreenCoords();
		return this.genSmoothBezierPathStringFromCoords(tailPos, headPos);
	};

	this.genSmoothBezierPathStringFromCoords = function(tailPos, headPos) {
		// we need to generate the path and control points for the bezier. format
		// is M(move abs) C (curve to) (control point 1) (control point 2) (final point)
		// the control points have to be __below__ to get the curve starting off straight.

		// would be useful if xiangxiang get married and the tree grows in the opposite direction
		var flipFactor = -1; 
		var coords = function(pos) {
			return String(Math.round(pos.x)) + ',' + String(Math.round(pos.y));
		};
		var offset = function(pos, dir, delta) {
			delta = delta || GRAPHICS.curveControlPointOffset;
			return {
				x : pos.x,
				y : pos.y + flipFactor * delta * dir
			};
		};
		var offset2d = function(pos, x, y) {
			return {
				x : pos.x + x,
				y : pos.y + flipFactor * y
			};
		};

		// first offset tail and head by radii
		if (this.isAlive()) {
			tailPos = offset(tailPos, -1, this.tail.getRadius() * 1.85);
		} else {
			tailPos = offset(tailPos, -1, this.tail.getRadius() * 2.15);
		}
		headPos = offset(headPos, 1, this.head.getRadius() * 1.05);

		var str = '';
		// first move to bottom of tail
		str += 'M' + coords(tailPos) + ' ';
		// start bezier
		str += 'C';
		// then control points above tail and below head
		str += coords(offset(tailPos, -1)) + ' ';
		str += coords(offset(headPos, 1)) + ' ';
		// now finish
		str += coords(headPos);

		// arrow head
		// var delta = GRAPHICS.arrowHeadSize || 10;
		// str += ' L' + coords(offset2d(headPos, -delta, delta));
		// str += ' L' + coords(offset2d(headPos, delta, delta));
		// str += ' L' + coords(headPos);

		// then go back, so we can fill correctly
		str += 'C';
		str += coords(offset(headPos, 1)) + ' ';
		str += coords(offset(tailPos, -1)) + ' ';
		str += coords(tailPos);

		return str;
	};

	this.getBezierCurve = function() {
		return this.genSmoothBezierPathString(this.tail, this.head);
	};
	
	this.initialize(options);

}
