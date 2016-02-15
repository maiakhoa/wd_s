/**
 * Match Height
 */
module.exports = ( function( window, $ ) {

	var that = {};
	var matchHeight = require( './vendor/jquery.matchHeight.js' );

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

})( window, require('jquery') );