function VisMember(options) {

	this.initialize = function(options) {
		// default values
		this.uuid = null;
		this.name = "unknow";
		this.gender = "male";
		this.birth = "1900-01-01";
		this.alive = true;
		this.death = "2100-01-01"; // use this only when alive is false
		this.image = "assets/members/not_found.png";
		this.parentsId = null;
		this.childrenId = null;
		this.spouseId = null;

		this.depth = undefined;
		this.maxWidth = null;

		this.circle = null;
		this.info = null;
		this.gender = null;

		this.pos = null;
		this.radius = null;
		
		this['float'] = 'none';

		this.stroke = GRAPHICS.defaultNodeStroke;
		this['stroke-width'] = GRAPHICS.defaultNodeStrokeWidth;

		// override and extend default values
		options = options || {};
		this.options = options;
		for (key in options) {
			this[key] = options[key];
		}

		this.validateAtInit();
	};

	this.validateAtInit = function() {
		if (!this.uuid) {
			throw new Error('need id for mapping');
		}

		if (!this.pos) {
			this.pos = {
				x : Math.random(),
				y : Math.random()
			};
		}
	};
	
	this.getRadius = function() {
		return this.radius || GRAPHICS.nodeRadius;
	};
	
	this.isMale = function() {
		return this.gender == "male" ? true : false;
	};

	// TODO: optimize following two functions
	this.addChild = function() {
		this.children = this.children || [];
		this.children = this.children.concat(_.flatten(arguments));
	};

	this.addParent = function() {
		this.parents = this.parents || [];
		this.parents = this.parents.concat(_.flatten(arguments));
	};

	// here we only use this for male
	this.addSpouse = function(spouse) {
		if (this.isMale()) {
			this.spouse = spouse;
		}
	};
	
	this.getAttributes = function() {
		var pos = this.getScreenCoords();
    	var infoPos = this.getInfoScreenCoords();
    	var opacity = this.getOpacity();
		return {
			circle: {
				cx: pos.x,
				cy: pos.y,
				opacity: opacity,
		        r: this.getRadius(),
		        // fill: this.getFill(),
		        'stroke-width': this['stroke-width'],
		        stroke: this.stroke
			},
			info: {
				x: pos.x,
				y: pos.y,
				opacity: opacity
			},
			image: {
				src: this.image
			}
		};
	};
	
	this.getOpacity = function() { return 1; };
	
	this.getScreenCoords = function() {
		var pos = this.pos;
		return this.familyVisuals.toScreenCoords(pos);
	};
	
	this.getInfoScreenCoords = function() {
		return this.getScreenCoords();
	};
	
	// for drawing
	this.genGraphics = function() {
		var paper = this.familyVisuals.paper;
		var circle = this.makeCircle(paper);
		var image = this.makeImage(paper);
		var info = this.makeText(paper);
		var gender = this.makeGender(paper);
		
		circle.toFront();
		
		this.circle = circle;
		this.image = image;
		this.info = info;
		this.gender = gender;
	};
	
	this.makeCircle = function(paper) {
		var pos = this.getScreenCoords();
		return paper.circle(
			pos.x,
			pos.y,
			this.getRadius()
		).attr(this.getAttributes().circle);
	};
	
	this.makeImage = function(paper) {
		var pos = this.getScreenCoords();
		return paper.image(this.image, pos.x - this.getRadius(), pos.y - this.getRadius(), 2 * this.getRadius(), 2 * this.getRadius());
	};

	this.makeText = function(paper) {
		function alignTop(text) {
 			var b = text.getBBox();
 			var h = Math.abs(b.y2) - Math.abs(b.y) + 1;
 			text.attr({'y': b.y + h});
 			return text;
		}
		var pos = this.getScreenCoords();
		var textString = this.name + "\n" + this.birth;
		if (!this.alive) {
			textString += "\n" + this.death;
		}
		var text = paper.text(pos.x, pos.y + this.getRadius() + 1, textString);
		return alignTop(text);
	};
	
	this.makeGender = function(paper) {
		
	};
	
	this.setDepthBasedOn = function(increment) {
		if (this.depth == undefined) {
			throw new Error(this.name + " no depth yet");
		}
		this.pos.y = this.depth * increment;
	};
	
	this.initialize(options);
}
