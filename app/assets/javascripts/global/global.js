/**
 * @author gu jun
 */

var xx = {

push: function (arr, val) {
	arr[arr.length] = val;
},

createElement: function (tag, attribs, styles, parent, nopad) {
	var el = document.createElement(tag);
	if (attribs) xx.extend(el, attribs);
	if (nopad) xx.setStyles(el, {padding: 0, border: 'none', margin: 0});
	if (styles) xx.setStyles(el, styles);
	if (parent) parent.appendChild(el);	
	return el;
},

getElementByClass : function (el, tagName, className) {
	var els = el.getElementsByTagName(tagName);
	for (var i = 0; i < els.length; i++) {
    	if ((new RegExp(className)).test(els[i].className)) {
			return els[i];
		}
	}
	return null;
},

extend: function (el, attribs) {
	// for (var x in attribs) el[x] = attribs[x];
	// return el;
	return _.extend(el, attribs);
},

setStyles: function (el, styles) {
	// for (var x in styles) {
		// if (hs.ieLt9 && x == 'opacity') {
			// if (styles[x] > 0.99) el.style.removeAttribute('filter');
			// else el.style.filter = 'alpha(opacity='+ (styles[x] * 100) +')';
		// }
		// else el.style[x] = styles[x];	
		// el.style[x] = styles[x];	
	// }
	_.extend(el.style, styles);
},

animate: function(el, prop, opt) {
	var start,
		end,
		unit;
		options;
	if (typeof opt != 'object' || opt === null) {
		var args = arguments;
		options = {
			duration: args[2],
			easing: args[3],
			complete: args[4]
		};
	} else {
		options = opt;
	}
	if (typeof options.duration != 'number') options.duration = 250;
	options.easing = Math[options.easing] || Math.easeInQuad;
	options.curAnim = xx.extend({}, prop);
	_.each(prop, function(value, key) {
		var e = new Animation(el, options, key);
		
		start = parseFloat(xx.css(el, key)) || 0;
		end = parseFloat(value);
		unit = key != 'opacity' ? 'px' : '';
		
		e.custom( start, end, unit );
	});
},

css: function(el, prop) {
	if (el.style[prop]) {
		return el.style[prop];
	} else if (document.defaultView) {
		return document.defaultView.getComputedStyle(el, null).getPropertyValue(prop);
	} else {
		// if (prop == 'opacity') prop = 'filter';
		// var val = el.currentStyle[prop.replace(/\-(\w)/g, function (a, b){ return b.toUpperCase(); })];
		// if (prop == 'filter') 
			// val = val.replace(/alpha\(opacity=([0-9]+)\)/, 
				// function (a, b) { return b / 100; });
		// return val === '' ? 1 : val;
	} 
}

};
