function FamilyTree() {
	
	this.initialize = function(options) {
		options = options || {};
		this.options = options;
		
		// this.visMemberMap = {};
		// this.visEdgeCollection = [];

		// this.baseId = options.baseId;
		// this.members = options.members;
		
		this.familyVisuals = new FamilyVisuals();
		this.familyVisuals.initialize(options);
		this.familyVisuals.initialBuildTree();
	};
	
	this.init = function() {
		var _this = this;
		$.ajax({
			type: "get",
			url: "/family_tree/members",
			dataType: "json"
		}).done(function(data) {
			_this.initialize(data);
		}).fail(function() {
			// TODO: 
		});
	};
}
