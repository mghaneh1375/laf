<?php
   /*
    
    Template Name: Full Width
    
    */
   
?>
   
<?php get_header(); ?>

<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'full' ); ?>

<?php $mt_page_title =  get_post_meta($post->ID, "mt_page_title", true);
	  $mt_page_subtitle = get_post_meta($post->ID, "mt_page_subtitle", true);
	  $mt_page_top_imgh = get_post_meta($post->ID, "mt_page_top_imgh", true);
  ?>

<section class="topSingleBkg topPageBkg" <?php if(!empty($mt_page_top_imgh)):?> style="height:<?php echo esc_attr( $mt_page_top_imgh ); ?>" <?php endif; ?>>  

<div class="item-img" <?php if(!empty($image)):?> style="background-image:url('<?php echo esc_url($image[0]); ?>');" <?php endif;?>></div>

  <div class="inner-desc">	 
  
 <h1 class="post-title single-post-title"><?php if(!empty($mt_page_title)): echo esc_html($mt_page_title); else: the_title(); endif;?></h1>
 
 <?php if(!empty($mt_page_subtitle)): ?>
 
 <span class="post-subtitle"> <?php echo esc_html($mt_page_subtitle); ?></span>
 
 <?php endif; ?>
 
 	</div>
  
</section>

<section id="wrap-content" class="page-content blog-post-single">

<div class="container">

<div class="row">

<div class="col-md-12 page-full">

<?php if (have_posts()) : while (have_posts()) : the_post(); ?>

<div id="post-<?php the_ID(); ?>" class="page-holder single-post-content custom-page-template clearfix">

<?php the_content(); ?>

</div>
<?php  endwhile;

else: ?>

<p class="alignc"><?php esc_html_e( 'Sorry, but it seems we can&rsquo;t find what you&rsquo;re looking for. Try the menu above.', 'caverta' ); ?></p>

<?php endif; ?>

<?php // If comments are open or we have at least one comment, load up the comment template.
	  if ( comments_open() || get_comments_number() ) :
	
			comments_template();
	
	 endif; ?>

</div><!--col-md-12-->

</div><!--row-->
</div><!--container-->
</section>

<?php get_footer(); ?>