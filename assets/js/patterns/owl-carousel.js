// Simple example of OwlCarousel.js
window.OwlCarousel = {};
( function( window, $, that ) {

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
			window: $( window ),
			carousel: $( '.owl-carousel' ),
		};
	};

	// Combine all events.
	that.bindEvents = function() {
		that.$c.window.on( 'load', that.owlCarousel_init );
	};

	// Do we meet the requirements?
	that.meetsRequirements = function() {
		return that.$c.carousel.length;
	};

	// Initialize Owl Carousel with options
	// http://owlgraphic.com/owlcarousel/index.html#customizing
	that.owlCarousel_init = function() {
		that.$c.carousel.owlCarousel({
			navigation : true, // Show next and prev buttons
			navigationText: ['<span>Previous</span>', '<span>Next</span>'],
			slideSpeed : 300,
			paginationSpeed : 400,
			singleItem:true
		})
	};

	// Engage!
	$( that.init );
	
})( window, jQuery, window.OwlCarousel );