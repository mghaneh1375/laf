<?php 

function caverta_customizer_css() {

	$custom_css = '';
	$body_styles = '';
	
	// start body

	$mt_body_font = get_theme_mod( 'mt_body_font', 'Work Sans');
	$mt_body_font_size = get_theme_mod( 'mt_body_font_size');
	$mt_body_text_color = get_theme_mod( 'mt_body_text_color');
	
	$body_styles .= 'font-family: ' . $mt_body_font . ';';
	
	if( !empty($mt_body_font_size) ) { $body_styles .= 'font-size: ' . $mt_body_font_size . 'px;'; }
	if( !empty($mt_body_text_color) ) { $body_styles .= 'color: ' . $mt_body_text_color . ';';
	
	 }
		
	$body_styles = 'body{' .$body_styles. '}';
	
	$custom_css .= $body_styles;
	$custom_css .= '.widgettitle, #respond h3 { font-family:'.$mt_body_font.', sans-serif; }';
	
	// post titles
	
	$mt_titles_font = get_theme_mod( 'mt_titles_font', 'Lora');
	$custom_css .= 'h1, h2, h3, h4, h5, h6, blockquote, .logo-txt{ font-family:'.$mt_titles_font.', serif; }';
	
	// link color
	
	$mt_link_color = get_theme_mod( 'mt_link_color');
	
	if (!empty($mt_link_color)){ $custom_css .= 'a:hover, p a:hover, .meta-categ a:hover, .meta-nav a:hover, .smalltitle, .view-more:hover, #submit:hover, .wpcf7-submit:hover, .current-page, .page-numbers:hover, .nav-page a:hover, .page-links a:hover, .post-password-form input[type="submit"]:hover, .icon-circle .elementor-icon, .elementor-widget-tabs .elementor-tab-title:hover, .elementor-widget-tabs .elementor-tab-title.elementor-active, .elementor-accordion .elementor-tab-title:hover, .elementor-accordion .elementor-tab-title.elementor-active, .menu-img span, .pcolor, .pcolori .elementor-icon{color:'.$mt_link_color.';}';
		$custom_css .= '.meta-categ:before, .post-meta li.meta-sticky, .smalltitle:before, .smalltitle:after, .tagcloud a:hover, .tags-single-page a:hover, .top-header{ background: '.$mt_link_color.';}';
		$custom_css .= '.slider-btn:hover, .icon-circle .elementor-icon{ border-color:'.$mt_link_color.'; }';
		$custom_css .= '.view-more, #submit, .wpcf7-submit, .page-numbers, .nav-page a, .page-links a, .post-password-form input[type="submit"]{ border-color:'.$mt_link_color.'; background: '.$mt_link_color.'; }';
		
		
		
	}
	
	// heavy color
	$mt_heavy_color = get_theme_mod( 'mt_heavy_color');
	
	if (!empty($mt_heavy_color)){
	
	$custom_css .= 'h1, h2, h3, h4, h5, h6, blockquote, a, .meta-nav a, .comment-author span, .comment-author .author a, .comment-reply-link, .widgettitle, .comment-reply-title, .tagcloud a, .tags-single-page a, .white-btn:hover, .btn-header	.view-more, .scrollup i{color:'.$mt_heavy_color.';}';
	
	$custom_css .= 'p a, .comment-reply-link, .elementor-accordion .elementor-tab-title{border-color:'.$mt_heavy_color.';}';
		
	}
	
	// headings size
	$mt_h1_size = get_theme_mod( 'mt_h1_size');
	if (!empty($mt_h1_size)){ $custom_css .= 'h1{font-size:'.$mt_h1_size.'px;}'; }
	
	$mt_h2_size = get_theme_mod( 'mt_h2_size');
	if (!empty($mt_h2_size)){ $custom_css .= 'h2{font-size:'.$mt_h2_size.'px;}'; }
	
	$mt_h3_size = get_theme_mod( 'mt_h3_size');
	if (!empty($mt_h3_size)){ $custom_css .= 'h3{font-size:'.$mt_h3_size.'px;}'; }
	
	$mt_h4_size = get_theme_mod( 'mt_h4_size');
	if (!empty($mt_h4_size)){ $custom_css .= 'h4{font-size:'.$mt_h4_size.'px;}'; }
	
	$mt_h5_size = get_theme_mod( 'mt_h5_size');
	if (!empty($mt_h5_size)){ $custom_css .= 'h5{font-size:'.$mt_h5_size.'px;}'; }
	
	$mt_h6_size = get_theme_mod( 'mt_h6_size');
	if (!empty($mt_h6_size)){ $custom_css .= 'h6{font-size:'.$mt_h6_size.'px;}'; }
	
	// menu colors
	
	$mt_menu_normal_color = get_theme_mod( 'mt_menu_normal_color');
	if (!empty($mt_menu_normal_color)){

	$custom_css .= '.menu-nav li a{color:'.$mt_menu_normal_color.';}';
	
	}
	
	$mt_menu_hover_color = get_theme_mod( 'mt_menu_hover_color');
	if (!empty($mt_menu_hover_color)){
		
	$custom_css .= '.menu-nav li a:hover, .menu-nav li a:focus, .menu-nav li:hover > a, .menu-nav > li.current-menu-item > a{color:'.$mt_menu_hover_color.';}';
	$custom_css .= '.menu-nav > li:hover > a:before, .menu-nav li.current-menu-item > a:before{border-color:'.$mt_menu_hover_color.';}';	
	
	}
	
	$mt_submenu_bkg_color = get_theme_mod( 'mt_submenu_bkg_color');
	 if (!empty($mt_submenu_bkg_color)){

	$custom_css .= '.menu-nav ul {background:'.$mt_submenu_bkg_color.';}';
	
	$custom_css .= '.menu-nav ul:before {border-color: transparent transparent '.$mt_submenu_bkg_color.' transparent;}';
	 
	 }
	 
	 $mt_submenu_normal_color = get_theme_mod( 'mt_submenu_normal_color');
	 if (!empty($mt_submenu_normal_color)){

	$custom_css .= '.menu-nav ul li > a{color:'.$mt_submenu_normal_color.';}';
	
	 }
	 
	  $mt_submenu_hover_color = get_theme_mod( 'mt_submenu_hover_color');
	 if (!empty($mt_submenu_hover_color)){  
	 
	 $custom_css .= '.menu-nav ul li a:hover, .menu-nav li:hover ul li a:hover{color:'.$mt_submenu_hover_color.';}';
	 
	 }
	 
	// footer colors
	$mt_footer_bkg_color = get_theme_mod( 'mt_footer_bkg_color');
	if (!empty($mt_footer_bkg_color)){ $custom_css .= 'footer{background:'.$mt_footer_bkg_color.';}'; }
	
	$mt_footer_txt_color = get_theme_mod( 'mt_footer_txt_color');
	if (!empty($mt_footer_txt_color)){ $custom_css .= 'footer{color:'.$mt_footer_txt_color.';}'; }
	
	 
	 if ( is_admin_bar_showing() ) { $custom_css .= '.headerHolder, .headerHolder4, .headerHolder5, .header-4.nav-fixed-top, .nav-holder-5.nav-fixed-top{top:32px;}'; }
	
	wp_add_inline_style( 'caverta-style-css', $custom_css );
	
}
	
add_action( 'wp_enqueue_scripts', 'caverta_customizer_css', 99);
?>