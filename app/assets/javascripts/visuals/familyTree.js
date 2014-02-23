function FamilyTree() {
	
	this.initialize = function(options) {
		options = options || {};
		this.options = options;
		
		// this.visMemberMap = {};
		// this.visEdgeCollection = [];

		// this.baseId = options.baseId;
		// this.members = options.members;
		
		this.familyVisuals = new FamilyVisuals(options);
		this.familyVisuals.refreshTree();
	};
	
	this.getJson = function() {
		var _this = this;
		$.ajax({
			url: "/family_tree.json",
			dataType: "json"
		}).done(function(data) {
			_this.initialize(data);
		}).fail(function() {
			// TODO: 
		});
	};

	this.getJson();
}
