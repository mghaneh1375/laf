<?php
/**
* The configuration options
*/

if ( ! function_exists( 'caverta_kirki_update_url' ) ) {
    function caverta_kirki_update_url( $config ) {
        $config['url_path'] = get_template_directory_uri() . '/include/customizer/kirki/';
        return $config;
    }
}
add_filter( 'kirki/config', 'caverta_kirki_update_url' );


if ( class_exists( 'Kirki' ) ) {

	/**
	 * Add sections
	 */
	 
	 Kirki::add_section( 'mt_headers', array(
		'title'          => esc_attr__( 'Headers', 'caverta' ),
		'priority'       => 50,
		'capability'     => 'edit_theme_options',
	) );
	
	Kirki::add_section( 'mt_general', array(
		'title'          => esc_attr__( 'General Options', 'caverta' ),
		'priority'       => 51,
		'capability'     => 'edit_theme_options',
	) );
	
	Kirki::add_section( 'mt_typography_options', array(
		'title'          => esc_attr__( 'Typography', 'caverta' ),
		'priority'       => 52,
		'capability'     => 'edit_theme_options',
	) );
	
	Kirki::add_section( 'mt_social_media', array(
		'title'          => esc_attr__( 'Social Media', 'caverta' ),
		'priority'       => 53,
		'capability'     => 'edit_theme_options',
	) );	
	
	 
/**
	 * Add the configuration.
	 * This way all the fields using the 'mt_fields' ID
	 * will inherit these options
	 */
	Kirki::add_config( 'mt_fields', array(
		'capability'    => 'edit_theme_options',
		'option_type'   => 'theme_mod',
	) );
	
	//Headers
	
	Kirki::add_field( 'mt_fields', array(
	'type'        => 'radio',
	'settings'    => 'mt_header_display',
	'label'       => esc_attr__( 'Top Header Display', 'caverta' ),
	'section'     => 'mt_headers',
	'default'     => 'mt_header1',
	'choices'     => array(
		'mt_header1'   => esc_attr__( 'Top Header 1', 'caverta' ),
		'mt_header2' => esc_attr__( 'Top Header 2', 'caverta' ),
		'mt_header3'  => esc_attr__( 'Top Header 3', 'caverta' ),
		'mt_header4'  => esc_attr__( 'Top Header 4', 'caverta' ),
		'mt_header5'  => esc_attr__( 'Top Header 5', 'caverta' ),
		'mt_header6'  => esc_attr__( 'Top Header 6', 'caverta' ),
		'mt_header7'  => esc_attr__( 'Top Header 7', 'caverta' ),
	),
) );

	Kirki::add_field( 'mt_fields', array(
	'type'        => 'switch',
	'settings'    => 'mt_header_fixed',
	'label'       => esc_attr__( 'Fixed Top Header', 'caverta' ),
	'section'     => 'mt_headers',
	'default'     => 'off',
	'choices'     => array(
		'on'  => esc_attr__( 'On', 'caverta' ),
		'off' => esc_attr__( 'Off', 'caverta' ),
	),
) );

	Kirki::add_field( 'mt_fields', array(
		'type'        => 'textarea',
		'settings'    => 'mt_header_btn',
		'label'       => esc_attr__( 'Header Button', 'caverta' ),
		'default'     => '',
		'section'     => 'mt_headers',
		'description' => esc_attr__( 'Add header button', 'caverta' ),
	) );
	
	Kirki::add_field( 'match_fields', array(
		'type'        => 'textarea',
		'settings'    => 'mt_header_info',
		'label'       => esc_attr__( 'Header Business Info', 'caverta' ),
		'default'     => '',
		'section'     => 'mt_headers',
		'description' => esc_attr__( 'Add header business info for header 4 and 5', 'caverta' ),
	) );

	Kirki::add_field( 'mt_fields', array(
		'type'        => 'textarea',
		'settings'    => 'mt_mobile_info',
		'label'       => esc_attr__( 'Mobile Business Info', 'caverta' ),
		'default'     => '',
		'section'     => 'mt_headers',
		'description' => esc_attr__( 'Add mobile menu business info', 'caverta' ),
	) );
	
	// general options
	
	Kirki::add_field( 'mt_fields', array(
	'type'        => 'radio',
	'settings'    => 'mt_home_top',
	'label'       => esc_attr__( 'Home - Slider or Video', 'caverta' ),
	'section'     => 'mt_general',
	'default'     => 'mt_home_top_slider',
	'choices'     => array(
		'mt_home_top_slider'   => esc_attr__( 'Slider', 'caverta' ),
		'mt_home_top_video' => esc_attr__( 'Video', 'caverta' ),
	),
) );
	
	Kirki::add_field( 'mt_fields', array(
	'type'        => 'repeater',
	'label'       => esc_attr__( 'Home - Slider Items', 'caverta' ),
	'section'     => 'mt_general',
	'description' => esc_attr__( 'Create home top slider. Add as much items as you want', 'caverta' ),
	'row_label' => array(
		'type' => 'text',
		'value' => esc_attr__('Slider Item', 'caverta' ),
	),
	'settings'    => 'mt_slides',
	'default'     => '',
	'fields' => array(
		'mt_slide_text' => array(
			'type'        => 'textarea',
			'label'       => esc_attr__( 'Slider Text', 'caverta' ),
			'description' => esc_attr__( 'Add slider text', 'caverta' ),
			'default'     => '',
		),
		'mt_slide_image' => array(
			'type'        => 'image',
			'label'       => esc_attr__( 'Slider Image', 'caverta' ),
			'description' => esc_attr__( 'Upload image file', 'caverta' ),
			'default'     => '',
		),
	)
) );

	Kirki::add_field( 'mt_fields', array(
		'type'        => 'textarea',
		'settings'    => 'mt_video_url',
		'label'       => esc_attr__( 'Home - Video URL', 'caverta' ),
		'default'     => '',
		'section'     => 'mt_general',
		'description'     => esc_attr__( 'Add home top video URL ( video must be self hosted )', 'caverta' ),
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'textarea',
		'settings'    => 'mt_video_text',
		'label'       => esc_attr__( 'Home - Video Text', 'caverta' ),
		'default'     => '',
		'section'     => 'mt_general',
		'description'     => esc_attr__( 'Add home top video text', 'caverta' ),
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'upload',
		'settings'    => 'mt_video_img',
		'label'       => esc_attr__( 'Home - Video Image Preloader', 'caverta' ),
		'default'     => '',
		'section'     => 'mt_general',
		'description'     => esc_attr__( 'Add video image preloader. Useful for slow speed connections.', 'caverta' ),
	) );

	Kirki::add_field( 'mt_fields', array(
	'type'        => 'radio-image',
	'settings'    => 'mt_home_articles_layout',
	'label'       => esc_attr__( 'Blog - Articles Layout', 'caverta' ),
	'section'     => 'mt_general',
	'description'     => esc_attr__( 'Select the articles layout for blog page', 'caverta' ),
	'default'     => 'mt_home_articles_layout_1col_list_left',
	'choices'     => array(
		'mt_home_articles_layout_1col' => get_template_directory_uri() . '/images/layouts/layout-1col.png',
		'mt_home_articles_layout_2col_grid' => get_template_directory_uri() . '/images/layouts/layout-2col.png',
		'mt_home_articles_layout_3col_grid' => get_template_directory_uri() . '/images/layouts/layout-3col.png',
		'mt_home_articles_layout_1col_list_left' => get_template_directory_uri() . '/images/layouts/layout-1col_list_left.png',
	),
) );

	Kirki::add_field( 'mt_fields', array(
	'type'        => 'radio-image',
	'settings'    => 'mt_sidebar',
	'label'       => esc_attr__( 'Blog - Sidebar Display', 'caverta' ),
	'section'     => 'mt_general',
	'description'     => esc_attr__( 'Select how do you want to display the sidebar for home / archive pages ( right / left / none )', 'caverta' ),
	'default'     => 'mt_sidebar_right',
	'choices'     => array(
		'mt_sidebar_right'   => get_template_directory_uri() . '/images/sidebar/sidebar-right.png',
		'mt_sidebar_left'   => get_template_directory_uri() . '/images/sidebar/sidebar-left.png',
		'mt_sidebar_no'   => get_template_directory_uri() . '/images/sidebar/sidebar-no.png',
	),
) );

	Kirki::add_field( 'mt_fields', array(
	'type'        => 'radio-image',
	'settings'    => 'mt_sidebar_single',
	'label'       => esc_attr__( 'Single Blog Page - Sidebar Display', 'caverta' ),
	'section'     => 'mt_general',
	'description'     => esc_attr__( 'Select how do you want to display the sidebar for single blog pages', 'caverta' ),
	'default'     => 'mt_sidebar_single_right',
	'choices'     => array(
		'mt_sidebar_single_right'   => get_template_directory_uri() . '/images/sidebar/sidebar-right.png',
		'mt_sidebar_single_left'   => get_template_directory_uri() . '/images/sidebar/sidebar-left.png',
		'mt_sidebar_single_no'   => get_template_directory_uri() . '/images/sidebar/sidebar-no.png',
	),
) );

	Kirki::add_field( 'mt_fields', array(
	'type'        => 'radio',
	'settings'    => 'mt_footer_widgets',
	'label'       => esc_attr__( 'Footer - Widgets Columns', 'caverta' ),
	'section'     => 'mt_general',
	'default'     => 'mt_footer_widgets4',
	'description'     => esc_attr__( 'Select the number of footer columns', 'caverta' ),
	'choices'     => array(
		'mt_footer_widgets1'   => esc_attr__( 'Footer Column 1', 'caverta' ),
		'mt_footer_widgets2' => esc_attr__( 'Footer Column 2', 'caverta' ),
		'mt_footer_widgets3'  => esc_attr__( 'Footer Column 3', 'caverta' ),
		'mt_footer_widgets4'  => esc_attr__( 'Footer Column 4', 'caverta' ),
	),
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'image',
		'settings'    => 'mt_footer_bkg',
		'label'       => esc_attr__( 'Footer - Background Image', 'caverta' ),
		'default'     => '',
		'description'     => esc_attr__( 'Add footer background image', 'caverta' ),
		'section'     => 'mt_general',
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'textarea',
		'settings'    => 'mt_footer_copy',
		'label'       => esc_attr__( 'Footer - Copyright', 'caverta' ),
		'default'     => '&copy; Caverta. Designed by MatchThemes.',
		'section'     => 'mt_general',
		'description'     => esc_attr__( 'Add footer copyright', 'caverta' ),
	) );
	
	Kirki::add_field( 'mt_fields', array(
	'type'        => 'switch',
	'settings'    => 'mt_scroll_top',
	'label'       => esc_attr__( 'Scroll Top Button', 'caverta' ),
	'section'     => 'mt_general',
	'default'     => 'off',
	'description'     => esc_attr__( 'Show/Hide scroll to top button', 'caverta' ),
	'choices'     => array(
		'on'  => esc_attr__( 'On', 'caverta' ),
		'off' => esc_attr__( 'Off', 'caverta' ),
	),
) );

	//colors
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'color',
		'settings'    => 'mt_body_text_color',
		'label'       => esc_attr__( 'Body Text Color', 'caverta' ),
		'default'     => '#252525',
		'section'     => 'colors',
		
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'color',
		'settings'    => 'mt_link_color',
		'label'       => esc_attr__( 'Link Color', 'caverta' ),
		'default'     => '#9fc4ce',
		'section'     => 'colors',
	) );

	Kirki::add_field( 'mt_fields', array(
		'type'        => 'color',
		'settings'    => 'mt_heavy_color',
		'label'       => esc_attr__( 'Heavy Color for Headings', 'caverta' ),
		'default'     => '#252525',
		'section'     => 'colors',
	) );
	
	//nav
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'color',
		'settings'    => 'mt_menu_normal_color',
		'label'       => esc_attr__( 'Menu Item - Normal State Color', 'caverta' ),
		'default'     => '#ffffff',
		'section'     => 'colors',
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'color',
		'settings'    => 'mt_menu_hover_color',
		'label'       => esc_attr__( 'Menu Item - Hover State Color', 'caverta' ),
		'default'     => '#9fc4ce',
		'section'     => 'colors',
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'color',
		'settings'    => 'mt_submenu_bkg_color',
		'label'       => esc_attr__( 'Menu Item - SubMenu Background Color', 'caverta' ),
		'default'     => '#9fc4ce',
		'section'     => 'colors',
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'color',
		'settings'    => 'mt_submenu_normal_color',
		'label'       => esc_attr__( 'Menu Item - SubMenu Normal Color', 'caverta' ),
		'default'     => '#252525',
		'section'     => 'colors',
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'color',
		'settings'    => 'mt_submenu_hover_color',
		'label'       => esc_attr__( 'Menu Item - SubMenu Hover Color', 'caverta' ),
		'default'     => '#454545',
		'section'     => 'colors',
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'color',
		'settings'    => 'mt_footer_bkg_color',
		'label'       => esc_attr__( 'Footer - Background Color', 'caverta' ),
		'default'     => '#000000',
		'section'     => 'colors',
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'color',
		'settings'    => 'mt_footer_txt_color',
		'label'       => esc_attr__( 'Footer - Text Color', 'caverta' ),
		'default'     => '#999999',
		'section'     => 'colors',
	) );
	
	//typography
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'select',
		'settings'    => 'mt_body_font',
		'label'       => esc_attr__( 'Body - Font Family', 'caverta' ),
		'default'     => 'Work Sans',
		'section'     => 'mt_typography_options',
		'description'     => esc_attr__( 'Select a font family from the Google Web Fonts', 'caverta' ),
		'choices'  => Kirki_Fonts::get_font_choices(),
		'priority'    => 1,
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'text',
		'settings'    => 'mt_body_font_weight',
		'label'       => esc_attr__( 'Body - Font Weight', 'caverta' ),
		'default'     => '300,400,500,600,700',
		'section'     => 'mt_typography_options',
		'description'     => esc_attr__( 'Add body font weights', 'caverta' ),
		'priority'    => 2,
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'text',
		'settings'    => 'mt_body_font_size',
		'label'       => esc_attr__( 'Body - Font Size', 'caverta' ),
		'default'     => '16',
		'section'     => 'mt_typography_options',
		'description'     => esc_attr__( 'Select body text font size ( in px )', 'caverta' ),
		'priority'    => 3,
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'select',
		'settings'    => 'mt_titles_font',
		'label'       => esc_attr__( 'Titles - Font Family', 'caverta' ),
		'default'     => 'Lora',
		'section'     => 'mt_typography_options',
		'description'     => esc_attr__( 'Select a font family from the Google Web Fonts', 'caverta' ),
		'choices'  => Kirki_Fonts::get_font_choices(),
		'priority'    => 4,
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'text',
		'settings'    => 'mt_titles_font_weight',
		'label'       => esc_attr__( 'Titles - Font Weight', 'caverta' ),
		'default'     => '400,700,400i,700i',
		'section'     => 'mt_typography_options',
		'description' => esc_attr__( 'Add post titles font weights', 'caverta' ),
		'priority'    => 5,
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'text',
		'settings'    => 'mt_h1_size',
		'label'       => esc_attr__( 'H1 - Font Size', 'caverta' ),
		'default'     => '54',
		'section'     => 'mt_typography_options',
		'description' => esc_attr__( 'Select H1 heading font size ( in px )', 'caverta' ),
		'priority'    => 6,
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'text',
		'settings'    => 'mt_h2_size',
		'label'       => esc_attr__( 'H2 - Font Size', 'caverta' ),
		'default'     => '48',
		'section'     => 'mt_typography_options',
		'description' => esc_attr__( 'Select H2 heading font size ( in px )', 'caverta' ),
		'priority'    => 7,
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'text',
		'settings'    => 'mt_h3_size',
		'label'       => esc_attr__( 'H3 - Font Size', 'caverta' ),
		'default'     => '36',
		'section'     => 'mt_typography_options',
		'description' => esc_attr__( 'Select H3 heading font size ( in px )', 'caverta' ),
		'priority'    => 8,
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'text',
		'settings'    => 'mt_h4_size',
		'label'       => esc_attr__( 'H4 - Font Size', 'caverta' ),
		'default'     => '32',
		'section'     => 'mt_typography_options',
		'description' => esc_attr__( 'Select H4 heading font size ( in px )', 'caverta' ),
		'priority'    => 9,
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'text',
		'settings'    => 'mt_h5_size',
		'label'       => esc_attr__( 'H5 - Font Size', 'caverta' ),
		'default'     => '24',
		'section'     => 'mt_typography_options',
		'description' => esc_attr__( 'Select H5 heading font size ( in px )', 'caverta' ),
		'priority'    => 10,
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'text',
		'settings'    => 'mt_h6_size',
		'label'       => esc_attr__( 'H6 - Font Size', 'caverta' ),
		'default'     => '16',
		'section'     => 'mt_typography_options',
		'description' => esc_attr__( 'Select H6 heading font size ( in px )', 'caverta' ),
		'priority'    => 11,
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'text',
		'settings'    => 'mt_social_facebook_url',
		'label'       => esc_attr__( 'Facebook URL', 'caverta' ),
		'default'     => '',
		'section'     => 'mt_social_media',
		'description' => esc_attr__( 'Add Facebook URL', 'caverta' ),
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'text',
		'settings'    => 'mt_social_twitter_url',
		'label'       => esc_attr__( 'Twitter URL', 'caverta' ),
		'default'     => '',
		'section'     => 'mt_social_media',
		'description' => esc_attr__( 'Add Twitter URL', 'caverta' ),
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'text',
		'settings'    => 'mt_social_instagram_url',
		'label'       => esc_attr__( 'Instagram URL', 'caverta' ),
		'default'     => '',
		'section'     => 'mt_social_media',
		'description' => esc_attr__( 'Add Instagram URL', 'caverta' ),
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'text',
		'settings'    => 'mt_social_linkedin_url',
		'label'       => esc_attr__( 'Linkedin URL', 'caverta' ),
		'default'     => '',
		'section'     => 'mt_social_media',
		'description' => esc_attr__( 'Add Linkedin URL', 'caverta' ),
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'text',
		'settings'    => 'mt_social_pinterest_url',
		'label'       => esc_attr__( 'Pinterest URL', 'caverta' ),
		'default'     => '',
		'section'     => 'mt_social_media',
		'description' => esc_attr__( 'Add Pinterest URL', 'caverta' ),
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'text',
		'settings'    => 'mt_social_trip_url',
		'label'       => esc_attr__( 'Trip Advisor URL', 'caverta' ),
		'default'     => '',
		'section'     => 'mt_social_media',
		'description' => esc_attr__( 'Add Trip Advisor URL', 'caverta' ),
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'text',
		'settings'    => 'mt_social_youtube_url',
		'label'       => esc_attr__( 'YouTube URL', 'caverta' ),
		'default'     => '',
		'section'     => 'mt_social_media',
		'description' => esc_attr__( 'Add YouTube URL', 'caverta' ),
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'text',
		'settings'    => 'mt_social_vimeo_url',
		'label'       => esc_attr__( 'Vimeo URL', 'caverta' ),
		'default'     => '',
		'section'     => 'mt_social_media',
		'description' => esc_attr__( 'Add Vimeo URL', 'caverta' ),
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'text',
		'settings'    => 'mt_social_dribbble_url',
		'label'       => esc_attr__( 'Dribbble URL', 'caverta' ),
		'default'     => '',
		'section'     => 'mt_social_media',
		'description' => esc_attr__( 'Add Dribbble URL', 'caverta' ),
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'text',
		'settings'    => 'mt_social_skype_url',
		'label'       => esc_attr__( 'Skype URL', 'caverta' ),
		'default'     => '',
		'section'     => 'mt_social_media',
		'description' => esc_attr__( 'Add Skype URL', 'caverta' ),
	) );
	
	Kirki::add_field( 'mt_fields', array(
		'type'        => 'text',
		'settings'    => 'mt_social_email_url',
		'label'       => esc_html__( 'Email Address', 'caverta' ),
		'default'     => '',
		'section'     => 'mt_social_media',
		'description' => esc_html__( 'Add email address', 'caverta' ),
	) );

}//endif