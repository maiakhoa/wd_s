// Rotate through series of Quotes
window.QuoteRotator = {};
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
			quoteRotator: $( '.quote-rotator' ),
			firstQuote: $( '.quote-rotator-content:gt(0)' ),
			secondQuote: $( '.quote-rotator-content:nth-child(2)' ),
			firstChild: $( '.quote-rotator-content:first-child' )
		};
	};

	// Combine all events.
	that.bindEvents = function() {
		that.$c.window.on( 'load', that.rotatorInit );
	};

	// Do we meet the requirements?
	that.meetsRequirements = function() {
		return that.$c.quoteRotator.length;
	};

	// initialize by hiding all quotes
	that.rotatorInit = function() {
		that.$c.firstQuote.hide();
		
		window.setInterval( function() {
			// setInterval to fadeIn next quote, and 
			that.$c.secondQuote.fadeIn( 400, function() {
				// append previous quote to quoteRotator
				that.$c.firstChild.hide().appendTo( that.$c.quoteRotator );
			});
		}, 3000);
	};

	// Engage!
	$( that.init );
	
})( window, jQuery, window.QuoteRotator );