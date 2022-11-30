<?php

if ( ! function_exists( 'caverta_setup' ) ) :

function caverta_setup() {
	
	load_theme_textdomain('caverta', get_theme_file_path() . '/languages');
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'title-tag' );	
	
	// Register Post Thumbnail
	add_theme_support( 'post-thumbnails' );
	set_post_thumbnail_size(600,500,true);
	add_image_size( 'caverta-image600x500', 600, 500, true );

	register_nav_menus(	array(
			'primary-menu' => esc_html__( 'Primary Menu', 'caverta'),
		)
	);
	
	/*
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
	) );	
	
	// Set up the WordPress core custom background feature
	add_theme_support( 'custom-background', apply_filters( 'caverta_custom_background_args', array(
		'default-color' => 'ffffff',
		'default-image' => '',
	) ) );
	
	// Add theme support for selective refresh for widgets
	add_theme_support( 'customize-selective-refresh-widgets' );
	
	// Add support for core custom logo
	add_theme_support( 'custom-logo', array(
		'height'      => 150,
		'width'       => 250,
		'flex-width'  => true,
		'flex-height' => true,
	) );
	
	// Add support for full and wide align images.
	add_theme_support( 'align-wide' );
	
	// Add support for Block Styles.
	add_theme_support( 'wp-block-styles' );
	
	// Add support for responsive embedded content.
	add_theme_support( 'responsive-embeds' );
	
	// Add support for custom header
	add_theme_support( 'custom-header' );
	
	// Add support for editor styles.
	add_theme_support( 'editor-styles' );

	// Enqueue editor styles.
	add_editor_style( 'css/style-editor.css' );
	
}
endif;

add_action( 'after_setup_theme', 'caverta_setup' );

function caverta_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'caverta_content_width', 1170 );
}
add_action( 'after_setup_theme', 'caverta_content_width', 0 );

// 1. Hide ACF field group menu item
add_filter('acf/settings/show_admin', '__return_false');

// 2. Include ACF
include_once( get_theme_file_path('/include/theme-settings.php') );

/* TGM Plugin Activation */
include_once ( get_theme_file_path('/include/tgm-plugin/plugin-install.php') );

// Add Theme Live Customizer options
include_once ( get_theme_file_path('/include/customizer/kirki/kirki.php') );
include_once ( get_theme_file_path('/include/customizer/customizer-options.php') );
include_once ( get_theme_file_path('/include/customizer/customizer-live.php') );

//Fixed Top Header
include_once ( get_theme_file_path('/include/header-sticky.php') );

//Add Google Web Fonts

if( !function_exists( 'caverta_fonts_url' ) ) {

function caverta_fonts_url() {
    $font_url = '';
	
	$mt_body_font = get_theme_mod( 'mt_body_font', 'Work Sans');
	$mt_body_font_weight = get_theme_mod( 'mt_body_font_weight', '300,400,500,600,700');
	$mt_titles_font = get_theme_mod( 'mt_titles_font', 'Lora');
	$mt_titles_font_weight = get_theme_mod( 'mt_titles_font_weight', '400,700,400i,700i');
    
    /*
    Translators: If there are characters in your language that are not supported
    by chosen font(s), translate this to 'off'. Do not translate into your own language.
     */
    if ( 'off' !== _x( 'on', 'Google font: on or off', 'caverta' ) ) {
	
	if ( $mt_body_font != $mt_titles_font ){
	
	 $font_url = add_query_arg( 'family', urlencode( $mt_body_font.':'.$mt_body_font_weight.'|'.$mt_titles_font.':'.$mt_titles_font_weight.'&display=swap'), "//fonts.googleapis.com/css" );
	
	}
	
	else{ $font_url = add_query_arg( 'family', urlencode( $mt_body_font.':'.$mt_body_font_weight.'&display=swap'), "//fonts.googleapis.com/css" );
	}
		
    }
    return $font_url;
}

}

if( !function_exists( 'caverta_fonts_script' ) ) {

function caverta_fonts_script() {

    wp_enqueue_style( 'caverta-fonts', caverta_fonts_url(), array(), null );
	
}
add_action( 'wp_enqueue_scripts', 'caverta_fonts_script' );

}

/**
* Enqueue editor styles for Gutenberg
*/
 
function caverta_editor_styles() {
	wp_enqueue_style('font-awesome1', get_theme_file_uri('/css/fontawesome/css/all.min.css'), array(), null);
    wp_enqueue_style( 'caverta-fonts', caverta_fonts_url(), array(), null );
}
add_action( 'enqueue_block_editor_assets', 'caverta_editor_styles' );


//	Register and load front end JS and CSS files
if( !function_exists( 'caverta_scripts_init' ) ) {
    function caverta_scripts_init() {
	
		wp_enqueue_style('bootstrap', get_theme_file_uri('/css/bootstrap/css/bootstrap.min.css'), array(), null);
		wp_enqueue_style('font-awesome1', get_theme_file_uri('/css/fontawesome/css/all.min.css'), array(), null);
		wp_enqueue_style('owl-carousel', get_theme_file_uri('/js/owl-carousel/owl.carousel.min.css'), array(), null);		
		wp_enqueue_style('caverta-style-css', get_parent_theme_file_uri('/style.css?' . time()), array(), null);	
		
		wp_enqueue_script('easing', get_theme_file_uri('/js/jquery.easing.min.js'), array( 'jquery' ),null,true);
		wp_enqueue_script('owl-carousel', get_theme_file_uri('/js/owl-carousel/owl.carousel.min.js'), array( 'jquery' ),null,true);
		wp_enqueue_script('fetchInfo', get_theme_file_uri('/js/fetchInfo.js?v=' . time()), array( 'jquery' ),null,true);
		wp_enqueue_script('magnific-popup', get_theme_file_uri('/js/jquery.magnific-popup.min.js'), array( 'jquery' ),null,true);
		
      	wp_enqueue_script('caverta-init', get_theme_file_uri('/js/init.js'), array( 'jquery' ),null,true);
		wp_enqueue_script('caverta-reservationform', get_theme_file_uri('/js/reservation-form.js'), array( 'jquery', 'jquery-form', 'jquery-ui-datepicker' ),null,true);
		
		if( is_single() ){
  			
			wp_enqueue_script('caverta-commentform', get_theme_file_uri('/js/commentform.js'), array( 'jquery', 'jquery-form' ),null,true);
			
			$translation_array = array( 'name_error' => esc_html__( 'Please fill the Name field!', 'caverta' ),
									'email_error' => esc_html__( 'Please fill the Email field!', 'caverta' ),
									'emailvalid_error' => esc_html__( 'Please provide a valid Email address!', 'caverta' ),
									'message_error' => esc_html__( 'Please fill the Message field!', 'caverta' ),
									'send_msg' => esc_html__( 'Sending comment...!', 'caverta' ),
									'msg_sent' => esc_html__( 'Comment sent', 'caverta' )
									 );
									 
		wp_localize_script( 'caverta-commentform', 'commFobject', $translation_array );
			
		}
		
	}
		
    
    add_action('wp_enqueue_scripts', 'caverta_scripts_init', 98);
}

function caverta_comments_reply() {
	
	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}

add_action( 'comment_form_before', 'caverta_comments_reply' );


// Register Sidebars

function caverta_widgets_init() {
	
	//main sidebar
	register_sidebar(array(
		'id' => 'sidebar-1',
		'name' => esc_html__( 'Sidebar','caverta'),
		'description' => esc_html__( 'Main sidebar that appears on a normal page.','caverta' ),
		'before_widget' => '<li id="%1$s" class="widget %2$s">',
		'after_widget' => '</li>',
		'before_title' => '<h5 class="widgettitle"><span>',
		'after_title' => '</span></h5>'
	));
	
	//footer 1
	register_sidebar(array(
		'name' => esc_html__( 'Footer 1','caverta'),
		'id' => 'footer-one',
		'description' => esc_html__( 'Widgets in this area are used in the first footer column','caverta' ),
		'before_widget' => '<div id="%1$s" class="widget widget-footer %2$s">',
		'after_widget' => '</div>',
		'before_title' => '<h5 class="widgettitle"><span>',
		'after_title' => '</span></h5>'
	));
	
	//footer 2
	register_sidebar(array(
		'name' => esc_html__( 'Footer 2','caverta'),
		'id' => 'footer-two',
		'description' => esc_html__( 'Widgets in this area are used in the second footer column','caverta' ),
		'before_widget' => '<div id="%1$s" class="widget widget-footer %2$s">',
		'after_widget' => '</div>',
		'before_title' => '<h5 class="widgettitle"><span>',
		'after_title' => '</span></h5>'
	));
	
	//footer 3
	register_sidebar(array(
		'name' => esc_html__( 'Footer 3','caverta'),
		'id' => 'footer-three',
		'description' => esc_html__( 'Widgets in this area are used in the third footer column','caverta' ),
		'before_widget' => '<div id="%1$s" class="widget widget-footer %2$s">',
		'after_widget' => '</div>',
		'before_title' => '<h5 class="widgettitle"><span>',
		'after_title' => '</span></h5>'
	));
	
	//footer 4
	register_sidebar(array(
		'name' => esc_html__( 'Footer 4','caverta'),
		'id' => 'footer-four',
		'description' => esc_html__( 'Widgets in this area are used in the fourth footer column','caverta' ),
		'before_widget' => '<div id="%1$s" class="widget widget-footer %2$s">',
		'after_widget' => '</div>',
		'before_title' => '<h5 class="widgettitle"><span>',
		'after_title' => '</span></h5>'
	));
	
	//footer instagram
		register_sidebar(array(
			'name' => esc_html__( 'Footer Instagram','caverta'),
			'id' => 'footer-instagram',
			'description' => esc_html__( 'We recommend to use only the Instagram widget here.','caverta' ),
			'before_widget' => '<div id="%1$s" class="widget-footer-instagram %2$s">',
			'after_widget' => '</div>',
			'before_title' => '<h5 class="widgettitle">',
			'after_title' => '</h5>'
		));
	
	
}
add_action( 'widgets_init', 'caverta_widgets_init' );

// Excerpt Content
function caverta_excerpt_length( $length ) {
	return 60;
}
add_filter( 'excerpt_length', 'caverta_excerpt_length');

function caverta_excerpt_more( $more ) {
	return '...';
}
add_filter('excerpt_more', 'caverta_excerpt_more');


// Add Custom Image Size to Media

function caverta_custom_image_sizes( $sizes ) {

	$imgSizes = array(
        'caverta-image600x500' => esc_html__('Custom Size', 'caverta'),
    );
	
	$sizes = array_merge( $sizes,  $imgSizes );

    return $sizes;
}

add_filter( 'image_size_names_choose', 'caverta_custom_image_sizes' );

//page navigation
function caverta_pagenavi( $p = 2 ) { // pages will be show before and after current page
  if ( is_singular() ) return; // don't show in single page
  global $wp_query, $paged;
  $max_page = $wp_query->max_num_pages;
  
  if ( $max_page == 1 ) return; // don't show when only one page
  if ( empty( $paged ) ) $paged = 1;
  echo '<div class="prev-next">';
  echo '<span class="nav-page">';
  previous_posts_link(esc_html__('&larr; Newer', 'caverta'));
  echo '</span>';
  if ( $paged > $p + 1 ) caverta_p_link( 1 );
  if ( $paged > $p + 2 ) echo '<span class="more-pages">...</span>';
  for( $i = $paged - $p; $i <= $paged + $p; $i++ ) { // Middle pages
    if ( $i > 0 && $i <= $max_page ) $i == $paged ? print "<span class='page-numbers current-page'>{$i}</span> " : caverta_p_link( $i );
  }
  if ( $paged < $max_page - $p - 1 ) echo '<span class="more-pages">...</span>';
  if ( $paged < $max_page - $p ) caverta_p_link( $max_page );
  echo '<span class="nav-page">';
  next_posts_link(esc_html__('Older &rarr;', 'caverta'));
  echo '</span>';
  echo '</div><!--end-->';
}
function caverta_p_link( $i ) {
  
  echo "<a class='page-numbers' href='", esc_html( get_pagenum_link( $i ) ), "'>{$i}</a> ";
}

//create new comments output
function caverta_custom_comments($comment, $args, $depth) {
	$GLOBALS['comment'] = $comment;
?>
	<li <?php comment_class(); ?> id="li-comment-<?php comment_ID() ?>">
		<div id="comment-<?php comment_ID(); ?>" class="comment-body <?php if ($comment->comment_approved == '0') echo 'pending-comment'; ?> clearfix">
                <div class="comment-details">
                    <div class="comment-avatar">
                        <?php echo get_avatar($comment, $size = '45'); ?>
                    </div><!-- /comment-avatar -->
                    
                    <div class="comment-right">
                    <section class="comment-author vcard">
                    <span class="author"><?php echo get_comment_author_link()?></span>
					<span class="comment-date"> <?php echo get_comment_date(); ?></span>
                    </section><!-- /comment-meta -->
                    <section class="comment-content">
    	                <div class="comment-text">
    	                    <?php comment_text() ?>
    	                </div><!-- /comment-text -->
    	                <div class="reply">
    	                    <?php comment_reply_link(array_merge( $args, array('reply_text' => esc_html__('Reply','caverta'),'depth' => $depth, 'max_depth' => $args['max_depth']))) ?>
    	                </div><!-- /reply -->
                    </section><!-- /comment-content -->
                    
                   </div><!-- /comment-right -->
                    
				</div><!-- /comment-details -->
		</div><!-- /comment -->
<?php

} //end custom_comments()

//remove Elementor Font Awesome

add_action( 'elementor/frontend/after_register_styles',function() {
	foreach( [ 'solid', 'regular', 'brands' ] as $style ) {
		wp_deregister_style( 'elementor-icons-fa-' . $style );
	}
}, 20 );

//remove Elementor Roboto fonts
add_filter( 'elementor/frontend/print_google_fonts', '__return_false' );
