/**
 * Mobile Navigation Double-Tap
 *
 * Disable the first click on a parent menu item for mobile,
 * so a user can click a parent menu item to view its children
 * but not be taken to the parent menu page.
 */
window.WDSOnClickMenu = {};
( function( window, $, that ) {

    // Constructor
    that.init = function() {
        that.cache();

        if ( that.meetsRequirements ) {
            that.bindEvents();
        }
    };

    // Cache all the things
    that.cache = function() {
        that.$c = {
            window: $(window),
            body: $( 'body' ),
            siteNavigation: $( '.double-tap-menu' ),
            parentMenuItem: $( '.menu-item-has-children' )
        };
    };

    // Combine all events
    that.bindEvents = function() {
        // Listen for all clicks to ensure we remove the tapped class when clicking outside of an opened submenu
        that.$c.body.on( 'click', that.removeDoubleTapClass );
    	// Listen for a click on our parent
        that.$c.body.on( 'click', '.menu-item-has-children a', that.beginDoubleTap );
    };

    // Do we meet the requirements?
    that.meetsRequirements = function() {
        return that.$c.siteNavigation.length;
    };

    // Trigger our double tap functionality
    that.beginDoubleTap = function( event ) {

    	// Check to see if our link has been tapped
        if ( $( this ).parent( 'li' ).hasClass( 'tapped-once' ) ) {
	    	// If we have already tapped our link once, let it be a normal link
	    	// Remove the class so it can be tapped like normal
        	$( this ).parent( 'li' ).removeClass( 'tapped-once' );
        } else {
        	// If we have not tapped our link, stop it from doing anything
	        event.preventDefault();
	    	that.$c.parentMenuItem.removeClass( 'tapped-once' );
        }

        // If this is the first click, or the link does not have the tapped-once class, add the class to EVERY parent LI up the submenu chain
        $( this ).parents( 'li' ).addClass( 'tapped-once' );
    };

    // Remove the tapped-once class if clicking outside of an opened submenu
    that.removeDoubleTapClass = function( event ) {

    	// Grab the clicked item's parent
        var thisParent = $( event.target ).parents( 'nav' );

        // If the clicked target is NOT the active parent menu item, remove the tapped-once class from parent menu items
        if ( ! thisParent.hasClass( 'double-tap-menu' ) ) {
        	that.$c.parentMenuItem.removeClass( 'tapped-once' );
        }
    };

    // Engage
    $( that.init );

})( window, jQuery, window.WDSOnClickMenu );