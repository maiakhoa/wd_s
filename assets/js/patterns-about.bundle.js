(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
// this is mostly for Pattern Library, as WP defines on its own
global.jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

window.non_flexbox_grid = require('./patterns/non-flexbox-grid.js');
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./patterns/non-flexbox-grid.js":2}],2:[function(require,module,exports){
(function (global){
/**
 * Match Height
 */
module.exports = ( function( window, $ ) {

	var that = {};

	// Constructor.
	that.init = function() {
		that.cache();

		if ( that.meetsRequirements ) {
			that.bindEvents();
		}
	};

	// Cache all the things.
	that.cache = function() {
		that.$c = {
			window: $(window),
			gridItem: $( '.grid-item' ),
		};
	};

	// Combine all events.
	that.bindEvents = function() {
		that.$c.window.on( 'load', that.matchGridItems );
	};

	// Do we meet the requirements?
	that.meetsRequirements = function() {
		return that.$c.gridItem.length;
	};

	// Match the height of all the cards.
	that.matchGridItems = function() {
		that.$c.gridItem.matchHeight({
			byRow: true,
			property: 'height',
			target: null,
			remove: false
		});
	};

	// Engage!
	$( that.init );
	
	return that;

})( window, (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null) );
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
