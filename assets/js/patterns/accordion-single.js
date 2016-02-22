window.SupportAccordionContent = {};
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
			accordionTrigger: $( '.accordion-trigger' ),
			htmlBody: $( 'html, body' ),
		};
	};

	// Combine all events.
	that.bindEvents = function() {
		that.$c.window.on( 'load', that.clickAccordionButton );
	};

	// Do we meet the requirements?
	that.meetsRequirements = function() {
		return that.$c.accordionTrigger.length;
	};

	// Listen for a click on our trigger buttons
	that.clickAccordionButton = function() {
		$( 'body' ).on( 'click', '.accordion-trigger', that.showHideContent );
	};

	// Show/hide the corresponding trigger's content
	that.showHideContent = function() {

		// If this accordion is already displaying its content, remove the class, hide the content, and return
		if ( $( this ).hasClass( 'active' ) ) {
			$( '.accordion-trigger' ).removeClass( 'active' );
			$( this ).parents( 'article' ).find( '.accordion-content' ).slideUp();
			return;
		}
		
		// Remove activec alss from all triggers
		$( '.accordion-trigger' ).removeClass( 'active' );
		
		// Add active class to THIS trigger
		$( this ).addClass( 'active' );
		
		// Slide all accordion content up
		$( '.accordion-content' ).slideUp();
		
		// Slide THIS accordion content down
		$( this ).parents( 'article' ).find( '.accordion-content' ).slideToggle();
	}

	// Engage!
	$( that.init );

})( window, jQuery, window.SupportAccordionContent );