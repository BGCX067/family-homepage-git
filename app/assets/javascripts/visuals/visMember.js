function VisMember(options) {

	this.initialize = function(options) {
		// default values
		this.uuid = null;
		this.name = "unknow";
		this.gender = "male";
		this.birth = "1900-01-01";
		this.alive = true;
		this.death = "2100-01-01"; // use this only when alive is false
		this.image = "assets\images\member\notfound.jpg";
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
		this.children.concat(_.flatten(arguments));
	};

	this.addParent = function() {
		this.parents = this.parents || [];
		this.parents.concat(_.flatten(arguments));
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
				cy: pox.y,
				opacity: opacity,
		        r: this.getRadius(),
		        // fill: this.getFill(),
		        'stroke-width': this['stroke-width'],
		        stroke: this.stroke
			},
			info: {
				
			}
		};
	};
	
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
		var circle = this.makeCircle();
		var info = this.makeText();
		var gender = this.makeGender();
		
		this.circle = circle;
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

	
	this.makeText = function(paper) {
		return paper.text();
	};
	
	this.makeGender = function(paper) {
		return paper.path();
	};
	
	this.setDepthBasedOn = function(increment) {
		if (!this.depth) {
			throw new Error("no depth yet");
		}
		this.pos.y = this.depth * increment;
	};
	
	this.initialize(options);
}
