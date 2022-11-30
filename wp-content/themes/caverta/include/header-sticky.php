<?php 

add_action( 'wp_enqueue_scripts', 'caverta_menu_sticky', 99 );

function caverta_menu_sticky() {
	
	$mt_header_fixed = get_theme_mod( 'mt_header_fixed', 'off');
	
	if($mt_header_fixed == 'on'):
	
	 if ( ! wp_script_is( 'jquery', 'done' ) ) {
     wp_enqueue_script( 'jquery' );
   }
   
   $custom_js2 = "";
   
   $custom_js2 = "(function($) {
    'use strict';
	
	$(window).on('scroll', function() {
  if ($(document).scrollTop() > 10) {
    $('.headerHolder, .header-4, .headerHolder5').addClass('nav-fixed-top');
	} else {
    $('.headerHolder, .header-4, .headerHolder5').removeClass('nav-fixed-top');
  }
  
  });
  
	})(jQuery);";
   
   wp_add_inline_script( 'caverta-init', $custom_js2 );
	
	endif;

}