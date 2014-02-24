function FamilyVisuals() {
	
	this.initialize = function(options) {
		options = options || {};
		this.options = options;
		// this.containerElement = options.containerElement;

		this.baseId = options.baseId;
		this.familyTree = options.familyTree;
		
		this.visMemberMap = {};
		this.visEdgeCollection = [];

		this.containerElement = $("#family_tree");

		var _this = this;

		// var containerElement = this.containerElement || $("#family_tree")[0];
		var containerElement = this.containerElement;
		new Raphael(containerElement, 200, 200, function() {
			var paper = this;
			_this.paperInitialize(paper, options);
		});
	};

	this.paperInitialize = function(paper, options) {
		this.paper = paper;
		
		// TODO: fill this in
		// this.tree = options.tree;
		// this.base = options.base;
  
		this.resizePaper();

		$(window).on('resize', _.bind(function() {
			this.resizePaper();
		}, this)); 

	};

	this.genTree = function(members) {
		// var _this = this;
		// create member node
		_.each(members, function(member, index) {
			this.validateMemberJson(member);
			this.genMember(member);
		}, this);
		// build tree, suppose:
		// 1. baseMember has no children
		// 2. toplevel members have no parents
		// 3. each member has at most one child
		// 4. husband stands in the left of wife
		// I will extend this ... to remove these suppose
		this.baseMember = this.visMemberMap[this.baseId];
		this.buildTreeNodeRecursive(this.baseId);
		this.buildTreeEdgeRecursive(this.baseId);
	};

	this.buildTreeNodeRecursive = function(id) {
		var member = this.visMemberMap[id];
		this.validateMemberNode(member);

		var parentsId = member.parentsId;
		if (!parentsId) {
			return;
		}
		_.each(parentsId, function(parentId) {
			var parent = this.visMemberMap[parentId];
			this.validateMemberNode(parent);

			member.addParent(parent);
			parent.addChild(member);

			this.buildTreeRecursive(parentId);
		}, this);

		var parents = member.parents;
		// only two parents
		if (parents[0].isMale()) {
			parents[0].addSpouse(parents[1]);
		} else {
			parents[1].addSpouse(parents[0]);
			// then swap position, let the first one be dad
			var tmp = parents[1];
			parents[1] = parents[0];
			parents[0] = tmp;
		}
	};
	
	this.buildTreeEdgeRecursive = function(id) {
		var member = this.visMemberMap[id];
		
		var parents = member.parents;
		if (!parents) {
			return;
		}
		
		_.each(parents, function(parent) {
			this.addEdge(id, parent);
		}, this);
	};

	this.addMember = function(member) {
		var visMember = new VisMember(_.extend(member, {
			familyVisuals: this
			/* TODO: other options start here */
		}));
		this.visMemberMap[member.uuid] = visMember;
	};

	/* drawing from head to tail */
	this.addEdge = function(idTail, idHead) {
		var visMemberTail = this.visMemberMap[idTail];
		var visMemberHead = this.visMemberMap[idHead];
		if (!visMemberTail || !visMemberHead) {
			throw new Error('at least one of the ids in (' + idTail + ', ' + idHead + ') does not exist');
		}
		
		var isBezier = this.isBase() || visMemberHead.isMale();
		var visEdge = new VisEdge({
			tail: idTail,
			head: idHead,
			isBesier: isBesier
			/* TODO: other options */
		});
		this.visEdgeCollection.push(visEdge);
	};
	
	this.isBase = function(id) {
		return id == this.baseId ? true : false;
	};

	this.validateMemberJson = function(member) {
		if (!member) {
			throw new Error("one member json is null");
		}
		if (!member.uuid || member.uuid < 0) {
			throw new Error("invalid member uuid");
		}

	};

	this.validateMemberNode = function(member) {
		if (!member) {
			throw new Error("no such member by id: " + id);
		}
		if (member.parentsId && member.parentsId.length != 2) {
			throw new Error("Can somebody's parents number other than 2?");
		}
	};
	
	// start for drawing tree
	this.refreshTree = function() {
		this.fullCalc();
		
		// this.animateAll(0);
	};
	
	this.fullCalc = function() {
		this.calcDepth();
		this.calcWidth();
	};
	
	this.calcDepth = function() {
		var maxDepth = this.calcMaxDepthRecusive(this.baseId, 0);
		this.calcDepthRecursive(this.baseId, maxDepth);
		
		var increment = this.getDepthIncrement(maxDepth);
		_.each(this.visMemberMap, function(member) {
			member.setDepthBasedOn(increment);
		});
	};
	
	this.calcMaxDepthRecusive = function(id, depth) {
		var member = this.visMemberMap[id];
		var parents = member.parents;
		// if (!parents || _.isEmpty(parents)) {
			// return depth;
		// }
		var maxDepth = depth;
		_.each(parents, function(parent) {
			var d = this.calcMaxDepthRecusive(parent.uuid, depth + 1);
			maxDepth = Math.max(maxDepth, d);
		}, this);
		return maxDepth;
	};
	
	// set depth attribute on each VisMember
	this.calcDepthRecursive = function(id, depth) {
		var member = this.visMemberMap[id];
		member.depth = depth;
		var parents = member.parents;
		// if (!parents || _.isEmpty(parents)) {
			// return;
		// }
		_.each(parents, function(parent) {
			this.calcDepthRecursive(parent.uuid, depth - 1);
		}, this);
	};
	
	this.calcWidth = function() {
		this.calcMaxWidthRecursive();
		var bounds = this.getPosBoundaries();
		this.assignBoundsRecursive(this.baseId, bounds.min, bounds.max);
	};
	
	this.calcMaxWidthRecursive = function(id) {
		var member = this.visMemberMap[id];
		var parents = member.parents;
		// if (!parents || _.isEmpty(parents)) {
			// return 1;
		// }
		var totalWidth = 0;
		_.each(parents, function(parent) {
			var w = this.calcMaxWidthRecursive(parent.uuid);
			totalWidth += w;
		}, this);
		var maxWidth = Math.max(totalWidth, 1);
		member.maxWidth = maxWidth;
		return maxWidth;
	};
	
	this.assignBoundsRecursive = function(id, min, max) {
		var member = this.visMemberMap[id];
		var pos = (min + max) / 2;
		member.pos.x = pox;
		var parents = member.parents;
		if (!parents || _.isEmpty(parents)) {
			return;
		}
		var totalFlex = member.maxWidth;
		var length = max - min;
		var preMin = min;
		_.each(parents, function(parent) {
			var portion = parent.maxWidth / totalFlex * length;
			var childMin = preMin;
			var childMax = childMin + portion;
			this.assignBoundsRecursive(parent.uuid, childMin, childMax);
			preMin += portion;
		}, this);
	};
	
	// would be useful if to draw legend on either side
	this.getPosBoundaries = function() {
		return {
			min: 0,
			max: 1
		};
	};
	
	// would be useful if to support different resolutions
	this.getMinLayers = function() {
		return 6;
	};
	
	this.getDepthIncrement = function(maxDepth) {
		// assume there are at least a number of layers until later
		// to have better visuals
		maxDepth = Math.max(maxDepth, this.getMinLayers());
		var increment = 1.0 / maxDepth;
		return increment;
	};
	
	// end for drawing tree

	this.resizePaper = function() {
		if (!this.paper) {
			return;
		}
		
		// var smaller = 1;
		var offset = this.containerElement.offset();
		var left = offset.left;
		var top = offset.top;
		
		var domElement = this.containerElement[0];
		var width = domElement.clientWidth; // - smaller;
		var height = domElement.clientHeight; // - smaller;
		
		$(this.paper.canvas).css({
			position: 'absolute',
			left: left + 'px',
			top: top + 'px'
		});

		this.paper.setSize(width, height);

	};

	this.initialize();
}

FamilyVisuals.prototype.toScreenCoords = function(pos) {
	if (!this.paper.width) {
		throw new Error('being called too early for screen coords');
	}
	var padding = this.getScreenPadding();

	var shrink = function(frac, total, padding) {
		return padding + frac * (total - padding * 2);
	};

	var asymShrink = function(frac, total, paddingTop, paddingBelow) {
		return paddingTop + frac * (total - paddingBelow - paddingTop);
	};

	var x = shrink(pos.x, this.paper.width, padding.widthPadding);
	var y = asymShrink(pos.y, this.paper.height, padding.topHeightPadding, padding.bottomHeightPadding);

	return {
		x: x,
		y: y
	};
};

FamilyVisuals.prototype.getScreenPadding = function() {
	return {
		widthPadding: GRAPHICS.nodeRadius * 1.5,
		topHeightPadding: GRAPHICS.nodeRadius * 1.5,
		bottomHeightPadding: GRAPHICS.nodeRadius * 3
	};
};
