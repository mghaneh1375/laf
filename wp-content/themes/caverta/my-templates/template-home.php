<?php
   /*
    
    Template Name: Home
    
    */
   
   get_header(); ?>
  
<?php $mt_home_top = get_theme_mod( 'mt_home_top', 'mt_home_top_slider');

if ( $mt_home_top == 'mt_home_top_slider'):

 ?>  
 
 <div class="slider-container">
   <div class="owl-carousel owl-theme home-slider">
      <?php $mt_slides = get_theme_mod( 'mt_slides', array() );
         if (!empty($mt_slides) ):
         
         foreach( $mt_slides as $mt_slide ): ?>   
      <div class="slider-post slider-item-box-bkg">
         <?php $mt_slide_img = wp_get_attachment_image_src( $mt_slide['mt_slide_image'] , 'full' ); ?>
         <div class="slider-img" style="background-image:url('<?php echo esc_url( $mt_slide_img[0] );  ?>');"></div>
         <div class="slider-caption">
            <div class="slider-text"><?php echo wp_kses_post( $mt_slide['mt_slide_text'] ); ?></div>
         </div>
         <!--slider-caption-->
      </div>
      <?php endforeach; ?>
      <?php endif; ?>
   </div>
</div>
 
 <?php else: ?>
 
 
 <?php $mt_video_url = get_theme_mod( 'mt_video_url', '');
 $mt_video_text = get_theme_mod( 'mt_video_text', '');
 $mt_video_img = get_theme_mod( 'mt_video_img', '');
 
if (!empty($mt_video_url) ):

 ?>
    
<div class="video-container">
<video id="video" class="video" preload="metadata" playsinline autoplay muted loop poster="<?php echo esc_url($mt_video_img); ?>">
<source src="<?php echo esc_url( $mt_video_url ); ?>" type="video/mp4">
</video>

<div class="slider-caption">
            <div class="slider-text"><?php echo wp_kses_post( $mt_video_text ); ?></div>
         </div>
		 
</div>

 <?php else: ?>
 
 <p class="alignc margin-t54"><?php esc_html_e( 'Please add a video URL in Appearance > Customize > General Settings > Home - Video URL option', 'caverta' ); ?></p>

 <?php endif; ?>

 <?php endif; ?>

<section id="wrap-content" class="page-content">
   <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
   <div id="post-<?php the_ID(); ?>" class="page-holder page-full custom-page-template page-home">
      <?php the_content(); ?>
   </div>
   <?php  endwhile;
      else: ?>
   <p class="alignc"><?php esc_html_e( 'Sorry, but it seems we can&rsquo;t find what you&rsquo;re looking for. Try the menu above.', 'caverta' ); ?></p>
   <?php endif; ?>
</section>
<?php get_footer(); ?>