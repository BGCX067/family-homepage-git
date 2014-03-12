/**
 * @author gu jun
 */

var Photo = function(gallery, options) {
	
	this.gallery = gallery;
	
	this.options = options || {};
	_.extend(this, this.options);
	
	// create image holder
	var img = document.createElement('img');
	img.onload = function() {
		this.nextPhoto();
	},
	img.contextmenu = function() {
		return false;
	};
	this.content = img;
	this.gallery.container.appendChild(img);
	
};

Photo.prototype = {

contentLoaded: function() {
	
},

showLoading: function() {
	
},

cancelLoading: function() {
	
},

nextPhoto: function() {
	
},

preloadPhoto: function() {
	
}
	
};
