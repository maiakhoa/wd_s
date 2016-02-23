/**
 * Simple Sticky Navigation Bar
 */
window.WDS_Sticky_Navigation = {};
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
            body: $( 'body' ),
            navBar: $( '.sticky-menu' ),
			navBarTop: $( '.sticky-menu' ).offset().top
        };
    };

    // Combine all events.
    that.bindEvents = function() {
        that.$c.window.on( 'scroll', that.stickNavToTop );
    };

    // Do we meet the requirements?
    that.meetsRequirements = function() {
        return that.$c.navBar.length;
    };

    // Stick nav to top.
    that.stickNavToTop = function() {
		
		// Find our window scroll position
		var scrollPosition = that.$c.window.scrollTop();
		
		// If we scroll to or beyond the top of our nav bar, stick it to the top of the window
		if ( scrollPosition >= that.$c.navBarTop ) {
			that.$c.body.addClass( 'sticky-nav' );
		} else {
			that.$c.body.removeClass( 'sticky-nav' );
		}
    };

    // Engage!
    $( that.init );

})( window, jQuery, window.WDS_Sticky_Navigation );