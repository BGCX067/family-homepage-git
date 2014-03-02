function init() {
	var tree = new FamilyTree();
	tree.init();
}

$(document).ready(init);
$(document).on('page:load', init);