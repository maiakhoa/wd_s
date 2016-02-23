window.WDSParallaxScroll = {};
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
            parallaxWindow: $( '.parallax-window' ),
            parallaxBackground: $( '.parallax-background' )
        };
    };

    // Combine all events
    that.bindEvents = function() {
        that.$c.window.on( 'load', that.runParallax );
        that.$c.window.on( 'scroll', that.runParallax );
    };

    // Do we meet the requirements?
    that.meetsRequirements = function() {
        return that.$c.parallaxWindow.length;
    };

    // Some function
    that.runParallax = function() {

        // Get some variables for our window div
        var parallaxWindowToTopOfPage    = that.$c.parallaxWindow.offset().top, // Distance from top of window to top of parallax window
            verticalScrollPosition       = $(window).scrollTop(), // The vertical scroll position of the window
            parallaxWindowToTopOfBrowser = parallaxWindowToTopOfPage - verticalScrollPosition; // Difference between the two values

        // Get some variables for our background div
        var parallaxBackgroundToTopOfPage       = that.$c.parallaxBackground.offset().top, // Distance from top of window to top of background window
            browserWindowInnerHeight            = window.innerHeight, // Inner height of the browser window
            parallaxBackgroundToTopOfBrowser    = parallaxBackgroundToTopOfPage - verticalScrollPosition, // Distance between the top of the background window and the top of the browser window
            parallaxBackgroundToBottomOfBrowser = browserWindowInnerHeight - parallaxBackgroundToTopOfBrowser, // Distance between the top of the background window and the bottom of the browser window
            plxSpeed                            = 0.35; // Animation speed

        // Run that sweet sweet parallax animation!
        that.$c.parallaxBackground.css( 'top', - ( parallaxWindowToTopOfBrowser * plxSpeed ) + 'px' );
    };

    // Engage
    $( that.init );

})( window, jQuery, window.WDSParallaxScroll );