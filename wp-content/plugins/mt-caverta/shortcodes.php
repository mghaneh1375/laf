<?php

/*

1. Testimonials
2. Blog 3 Cols
3. Gallery
4. Open Table Reservation

*/

// 1. Testimonials

function caverta_shortcode_testimonials( $atts ){ 

extract( shortcode_atts( array(
    'id'          => '',
    'count'       => '12',
	'post_id' => '',
  ), $atts, 'testimonials' ) );
  

	$output = '';
	
	if (!empty($post_id)):
	 
	 $mt_postsIDS = explode(',', $post_id);
	 
	 $blog_args = array('post_type' => 'mt_testimonials', 'ignore_sticky_posts' => 1, 'orderby' =>'post__in', 'post__in' => $mt_postsIDS );
	 
	 else:
	 
	$blog_args = array('post_type' => 'mt_testimonials', 'posts_per_page' => esc_attr( $count ) ); 
	 
	endif;
		
	$blog_query = new WP_Query($blog_args);
	
	if (!empty($id)): $output .= '<div id="'. esc_attr( $id ) .'" class="owl-carousel owl-theme testimonial-slider">';
	
	else: $output .= '<div class="owl-carousel owl-theme testimonial-slider">';
	
	endif;
 
	if ($blog_query -> have_posts()) : while ($blog_query -> have_posts()) : $blog_query -> the_post();
	
	$output .= '<div class="testimonial-info">'. get_the_content() .'</div>';
	
	endwhile; endif; wp_reset_postdata();
	
	$output .= '</div>';

return $output;

}

add_shortcode( 'testimonials', 'caverta_shortcode_testimonials' );

// 2. Blog 3 Cols

function caverta_shortcode_blog_3cols( $atts ){ 

extract( shortcode_atts( array(
    'id'          => '',
    'count'       => '3'
  ), $atts, 'blog_3cols' ) );

	$output = '';
	
	if (!empty($id)): $output .= '<div id="'. esc_attr( $id ) .'" class="blog-3col-grid home-blog-grid">';
	
	else: $output .= '<div class="blog-3col-grid home-blog-grid">';
	
	endif;
	
	global $wp_query;
	$count_posts = 0;
	$defaults = array('post_type' => 'post', 'posts_per_page' => esc_attr( $count ));
	$blog_query = new WP_Query($defaults);
	
	if ( $blog_query -> have_posts()) : while ( $blog_query -> have_posts()) : $blog_query -> the_post(); 
	
	if ($count_posts % 3 == 0): $output .= '<div class="row">';   endif;
	
	$output .= '<div class="col-md-4">';
	$output .= '<article id="post-'.get_the_ID().'" class="blog-item blog-item-3col-grid">';
	
	if ( has_post_thumbnail( get_the_ID() ) ):
	
	$output .= '<a href="'. get_permalink() .'"><div class="post-image">'. get_the_post_thumbnail( get_the_ID(), "caverta-image600x500", array( "class" => "img-fluid img-featured", "alt" => '' .get_the_title().'' )).'</div></a>';
		
	endif;
	
	$output .= '<div class="post-holder post-content content-grid">';
	$output .= '<ul class="post-meta"><li class="meta-date">'. get_the_date(get_option('date_format')) .'</li>';

	$categories = get_the_category();
	
	if(!empty($categories)):
	
	$output .= '<li class="meta-categ">';
	
	foreach( $categories as $category ):
	
	$output .= ' <a href="' . get_category_link( $category->term_id ) . '">'. $category->name .'</a>';
	
	endforeach;
	
	$output .= '</li>';
	
	endif;
	
	$output .= '</ul>';
	
	$output .= '<h2 class="article-title"><a href="'. get_permalink() .'">'. get_the_title() .'</a></h2>';
	$output .= '<p>'. wp_trim_words( get_the_excerpt(), 30, ' ...' ) .'</p>';
	$output .= '<a class="view-more" href="'. get_permalink() .'">'. esc_html__('Read More', 'caverta') .'</a>';
	$output .= '</div></article></div>';
	
	$count_posts++;
	
	if(($count_posts % 3) == 0) { $output .= '</div>';  }
	
	endwhile;
	endif;
	
	if(($count_posts % 3) == 1 || ($count_posts % 3) == 2 ) { $output .= '</div>';  }
	
	wp_reset_postdata();

	$output .=  '</div>';

	return $output;

}

add_shortcode( 'blog_3cols', 'caverta_shortcode_blog_3cols' );

// 3. Gallery 3/4 Cols

function caverta_shortcode_gallery( $atts ){ 

extract( shortcode_atts( array(
    'id' => '',
	'post_id' => '',
	'cols' => '4',
  ), $atts, 'mt_gallery' ) );

	$output = '';
	
	if ( function_exists( 'get_field' )):
	
	$mt_gallery_images = get_field('mt_gallery_images', esc_attr($post_id));
	
	endif;

	if(!empty($mt_gallery_images)):
	
	if(!empty($id)): $output .= '<div id="'. esc_attr( $id ) .'" class="gallery-container">';
	
	else: $output .= '<div class="gallery-container">';
	
	endif;
	
	if( $cols == 4 ):
	
	$output .='<div class="gallery-holder gallery-4cols">';
	
	else: $output .='<div class="gallery-holder gallery-3cols">';
	
	endif;
	
	foreach ( $mt_gallery_images as $piece ):
		
	$output .= '<div class="gallery-post"><a href="'. $piece["url"] .'" class="lightbox" title="'. $piece["caption"] .'" data-elementor-open-lightbox="no"><div class="gallery-img" style="background-image:url('. $piece["url"] .')"></div><div class="gallery-desc"><div class="gallery-view"><i class="fa fa-eye"></i></div></div></a></div>';	
	
	endforeach;

	$output .= '</div></div>';
	
	else:
		
	$output .= esc_html__('Gallery Shortcode: Make sure you have added gallery images via Galleries option and the post ID is correct', 'caverta');
	
	endif;
	
	
return $output;

}

add_shortcode( 'mt_gallery', 'caverta_shortcode_gallery' );	

// 4. OpenTable Reservation

function ravier_shortcode_open_table_reservation( $atts ){ 

extract( shortcode_atts( array(
    'id'          => '',
	'btn_txt'       => 'FIND A TABLE',
	'people_txt'       => 'How many',
	'date_txt'       => 'When',
	'time_txt'       => 'What Time',
	
  ), $atts, 'match_opentable' ) );

	$output = '';
	
	if (!empty($id)):
	
	$output .= '<form class="mt-opentable" action="//www.opentable.com/restaurant-search.aspx" target="_blank">';
	$output .='<div class="row"><div class="col-md-4"><label>'. esc_attr( $people_txt ) .'</label><select id="mt-otsize" name="partySize" class="comm-field">	<option value="1">1 Person</option><option value="2" selected="selected">2 People</option><option value="3">3 People</option><option value="4">4 People</option><option value="5">5 People</option><option value="6">6 People</option><option value="7">7 People</option><option value="8">8 People</option><option value="9">9 People</option>	<option value="10">10 People</option></select></div><div class="col-md-4"><label>'. esc_attr( $date_txt ) .'</label><input id="mt-otdate" type="text" name="startDate" value="'. current_time( "m-d-Y" ) .'" class="datepicker-ot comm-field" /></div><div class="col-md-4"><label>'. esc_attr( $time_txt ) .'</label><select id="mt-ottime" name="ResTime" class="comm-field"><option value="7:00am">7:00 am</option><option value="7:30am">7:30 am</option><option value="8:00am">8:00 am</option><option value="8:30am">8:30 am</option><option value="9:00am">9:00 am</option><option value="9:30am">9:30 am</option><option value="10:00am">10:00 am</option><option value="10:30am">10:30 am</option><option value="11:00am">11:00 am</option><option value="11:30am">11:30 am</option><option value="12:00pm">12:00 pm</option><option value="12:30pm">12:30 pm</option><option value="1:00pm">1:00 pm</option><option value="1:30pm">1:30 pm</option><option value="2:00pm">2:00 pm</option><option value="2:30pm">2:30 pm</option><option value="3:00pm">3:00 pm</option><option value="3:30pm">3:30 pm</option><option value="4:00pm">4:00 pm</option><option value="4:30pm">4:30 pm</option><option value="5:00pm">5:00 pm</option><option value="5:30pm">5:30 pm</option><option value="6:00pm">6:00 pm</option><option value="6:30pm">6:30 pm</option><option value="7:00pm" selected="selected">7:00 pm</option><option value="7:30pm">7:30 pm</option><option value="8:00pm">8:00 pm</option><option value="8:30pm">8:30 pm</option><option value="9:00pm">9:00 pm</option><option value="9:30pm">9:30 pm</option><option value="10:00pm">10:00 pm</option><option value="10:30pm">10:30 pm</option><option value="11:00pm">11:00 pm</option></select>
</div>
</div><div class="mt-otbutton icon-img"><button type="submit" class="submit">'. esc_attr( $btn_txt ) .'</button><img src="'. get_template_directory_uri().'/images/open-table.png" alt="" /></div>';
	$output .= '<input name="RestaurantID" class="RestaurantID" value="'. esc_attr( $id ) .'" type="hidden" /><input name="rid" class="rid" value="'. esc_attr( $id ) .'" type="hidden" /><input name="GeoID" class="GeoID" value="15" type="hidden" /><input name="txtDateFormat" class="txtDateFormat" value="mm-dd-yyyy" type="hidden" /><input name="RestaurantReferralID" class="RestaurantReferralID" value="'. esc_attr( $id ) .'" type="hidden" /></form>';
	
	else:
	
	$output .= esc_html__('OpenTable Shortcode: Make sure your OpenTable ID is correct', 'ravier');
	
	endif;

return $output;

}

add_shortcode( 'match_opentable', 'ravier_shortcode_open_table_reservation' );