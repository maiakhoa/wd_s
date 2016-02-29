<?php
/**
 * <%= appString %> Theme Customizer.
 *
 * @package <%= appString %>
 */

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function <%= appString %>_customize_register( $wp_customize ) {
	$wp_customize->get_setting( 'blogname' )->transport         = 'postMessage';
	$wp_customize->get_setting( 'blogdescription' )->transport  = 'postMessage';
	$wp_customize->get_setting( 'header_textcolor' )->transport = 'postMessage';

	// Add our social link options
    $wp_customize->add_section(
        '<%= appString %>_social_links_section',
        array(
            'title'       => __( 'Social Links', '<%= appString %>' ),
            'description' => __( 'These are the settings for social links. Please limit the number of social links to 5.', '<%= appString %>' ),
            'priority'    => 90,
        )
    );

    // Create an array of our social links for ease of setup
    $social_networks = array( 'twitter', 'facebook', 'instagram' );

    // Loop through our networks to setup our fields
    foreach( $social_networks as $network ) {

	    $wp_customize->add_setting(
	        '<%= appString %>_' . $network . '_link',
	        array(
	            'default' => '',
	            'sanitize_callback' => '<%= appString %>_sanitize_customizer_url'
	        )
	    );
	    $wp_customize->add_control(
	        '<%= appString %>_' . $network . '_link',
	        array(
	            'label'   => sprintf( __( '%s Link', '<%= appString %>' ), ucwords( $network ) ),
	            'section' => '<%= appString %>_social_links_section',
	            'type'    => 'text',
	        )
	    );
    }

    // Add our Footer Customization section section
    $wp_customize->add_section(
        '<%= appString %>_footer_section',
        array(
            'title'    => __( 'Footer Customization', '<%= appString %>' ),
            'priority' => 90,
        )
    );

    // Add our copyright text field
    $wp_customize->add_setting(
        '<%= appString %>_copyright_text',
        array(
            'default'           => ''
        )
    );
    $wp_customize->add_control(
        '<%= appString %>_copyright_text',
        array(
            'label'       => __( 'Copyright Text', '<%= appString %>' ),
            'description' => __( 'The copyright text will be displayed beneath the menu in the footer.', '<%= appString %>' ),
            'section'     => '<%= appString %>_footer_section',
            'type'        => 'text',
            'sanitize'    => 'html'
        )
    );
}
add_action( 'customize_register', '<%= appString %>_customize_register' );

/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
function <%= appString %>_customize_preview_js() {
    wp_enqueue_script( '<%= appString %>_customizer', get_template_directory_uri() . '/assets/js/customizer.js', array( 'customize-preview' ), '20130508', true );
}
add_action( 'customize_preview_init', '<%= appString %>_customize_preview_js' );

/**
 * Sanitize our customizer text inputs
 */
function <%= appString %>_sanitize_customizer_text( $input ) {
    return sanitize_text_field( force_balance_tags( $input ) );
}

/**
 * Sanitize our customizer URL inputs
 */
function <%= appString %>_sanitize_customizer_url( $input ) {
    return esc_url( $input );
}
