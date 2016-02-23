/**
 * Off-Canvas Navigation: Open Door
 *
 * http://tympanus.net/codrops/2013/08/28/transitions-for-off-canvas-navigations/
 * https://github.com/codrops/SidebarTransitions
 */
window.WDS_Off_Canvas_Navigation_Open_Door = {};
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
			body: $( 'body' ),
			menuClose: $( '.menu-close' ),
			menuMore: $( '.menu-more' ),
			siteContainer: $( '.site' ),
			subMenu: $( '.main-navigation .dropdown .sub-menu' ),
			window: $( window )
		};
	};

	// Combine all events.
	that.bindEvents = function() {
		that.$c.window.on( 'load', that.moveDrawer );
		that.$c.menuMore.on( 'click', that.toggleDoor );
		that.$c.menuClose.on( 'click', that.toggleDoor );
	};

	// Do we meet the requirements?
	that.meetsRequirements = function() {
		return that.$c.subMenu.length;
	};

	// Move the door outside the rotater, and then wrap it in a section.
	that.moveDrawer = function() {
		that.$c.subMenu.appendTo( that.$c.siteContainer ).wrap( '<section class="off-canvas-drawer"></section>' ).removeClass( 'sub-menu' );
	}

	// Toggle that door.
	that.toggleDoor = function() {
		that.$c.body.toggleClass( 'open-door' );
	};

	// Engage!
	$( that.init );

})( window, jQuery, window.WDS_Off_Canvas_Navigation_Open_Door );