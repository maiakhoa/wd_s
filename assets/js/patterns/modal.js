window.WDS_Modal = {};

(function( window, $, that ) {

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
            modal:      $( '.modal' ),
            modalCheck: $( '#modal-check' ),
            modalClose: $( '.modal-fade-screen, .modal-close' ),
            modalInner: $( '.modal-inner' ),
        };
    };

    // Do we meet the requirements?
    that.meetsRequirements = function() {
        return that.$c.modal.length;
    };

    // Combine all events.
    that.bindEvents = function() {
        that.$c.window.on( 'load', that.toggleModal );
    };

    // Toggle the modal!
    that.toggleModal = function() {

        // Toggle a 'modal-open' class to the <body> when .modal-check is checked
        that.$c.modalCheck.on( "change", function() {
            if ( $( this ).is( ":checked" ) ) {
                $( "body" ).addClass( "modal-open" );
            } else {
                $( "body" ).removeClass( "modal-open" );
            }
        });

        // Close modal when close button is clicked
        that.$c.modalClose.on( "click", function() {
            $( ".modal-state:checked" ).prop( "checked", false ).change();
        });

        // Stop bubble - don't notify parents about this event
        that.$c.modalInner.on( "click", function(e) {
            e.stopPropagation();
        });
    };

    // Engage!
    $( that.init );

})( window, jQuery, window.WDS_Modal );