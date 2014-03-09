/**
 * @author gu jun
 */

var Photo = function(gallery, options) {
	
	this.gallery = gallery;
	
	this.options = options || {};
	
	// create image holder
	var img = document.createElement('img');
	img.onclick = function() {
		
	};
	this.content = img;
	gallery.container.appendChild(img);
	
};

Photo.prototype = {

contentLoaded: function() {
	
},

showLoading: function() {
	
},

cancelLoading: function() {
	
}
	
};
