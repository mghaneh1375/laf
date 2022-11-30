<?php
/*
Plugin Name: MT Caverta
Plugin URI: 
Description: The plugin is required to run Caverta theme
Author: matchthemes
Author URI: https://matchthemes.com
Text Domain: caverta
Domain Path: /languages
Version: 1.1.5
License: GNU General Public License v3.0
License URI: http://www.opensource.org/licenses/gpl-license.php
*/


// Add Custom Post Types

add_action('init', 'caverta_custom_post_types');

function caverta_custom_post_types() {
	
	// load language files.
	load_plugin_textdomain( 'caverta', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );


// Gallery Custom Post Type

$labelsGallery = array(
		'name' => esc_html__('Galleries', 'caverta'),
		'singular_name' => esc_html__('Gallery', 'caverta'),
		'add_new' => esc_html__('Add New Gallery', 'caverta'),
		'add_new_item' => esc_html__('Add New Gallery', 'caverta'),
		'edit_item' => esc_html__('Edit Gallery', 'caverta'),
		'new_item' => esc_html__('New Gallery', 'caverta'),
		'view_item' => esc_html__('View Gallery', 'caverta'),
		'search_items' => esc_html__('Search Gallery', 'caverta'),
		'not_found' =>  esc_html__('Nothing found', 'caverta'),
		'not_found_in_trash' => esc_html__('Nothing found in Trash', 'caverta'),
		'parent_item_colon' => ''
	
		);
	
    	$gallery_args = array(
        	'labels' => $labelsGallery,
        	'label' => esc_html__('Gallery','caverta'),
        	'singular_label' => esc_html__('Gallery','caverta'),
        	'public' => true,
        	'show_ui' => true,
			'menu_icon' => 'dashicons-images-alt2',
        	'capability_type' => 'post',
        	'hierarchical' => false,
        	'rewrite' => array('slug' => 'gallery','with_front' => false),
        	'supports' => array('title', 'editor', 'thumbnail')
        );
		register_post_type('mt_gallery',$gallery_args);
		
	// Testimonials Custom Post Type
		
	$mt_testimonials_labels = array(
		'name' => esc_html__('Testimonials', 'caverta'),
		'singular_name' => esc_html__('Testimonial', 'caverta'),
		'add_new' => esc_html__('Add New Testimonial', 'caverta'),
		'add_new_item' => esc_html__('Add New Testimonial', 'caverta'),
		'edit_item' => esc_html__('Edit Testimonial', 'caverta'),
		'new_item' => esc_html__('New Testimonial', 'caverta'),
		'view_item' => esc_html__('View Testimonial', 'caverta'),
		'all_items' => esc_html__( 'All Testimonials', 'caverta' ),
		'search_items' => esc_html__('Search Testimonials', 'caverta'),
		'not_found' =>  esc_html__('Nothing found', 'caverta'),
		'not_found_in_trash' => esc_html__('Nothing found in Trash', 'caverta'),
		'parent_item_colon' => ''
		);
	
    	$mt_testimonials_args = array(
        	'labels' => $mt_testimonials_labels,
        	'label' => esc_html__('Testimonials', 'caverta'),
        	'singular_label' => esc_html__('Testimonials', 'caverta'),
        	'public' => true,
        	'show_ui' => true,
			'menu_icon' => 'dashicons-testimonial',
        	'capability_type' => 'post',
        	'hierarchical' => false,
        	'rewrite' => array('slug' => 'testimonial','with_front' => false),
        	'supports' => array('title', 'editor', 'thumbnail')
        );
		register_post_type('mt_testimonials',$mt_testimonials_args);		
		

}

add_action('init', 'caverta_shortcodes');

function caverta_shortcodes() {

require_once( 'shortcodes.php' );

}