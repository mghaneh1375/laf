<?php get_header(); ?>
<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'full' ); ?>
<?php $mt_page_subtitle = get_post_meta($post->ID, "mt_gallery_subtitle", true); ?>
<section class="topSingleBkg topPageBkg topSingleGalleryBkg">
   <div class="item-img" <?php if(!empty($image)):?> style="background-image:url('<?php echo esc_url($image[0]); ?>');" <?php endif;?>></div>
   <div class="inner-desc">
      <h1 class="post-title single-post-title"><?php the_title(); ?></h1>
      <?php if(!empty($mt_page_subtitle)): ?>
      <span class="post-subtitle"> <?php echo esc_html($mt_page_subtitle); ?></span>
      <?php endif; ?>
   </div>
</section>
<section id="wrap-content" class="page-content">
   <div class="container">
      <div class="row">
         <div class="col-md-12">
            <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
            <div id="post-<?php the_ID(); ?>" class="page-holder custom-page-template">
               <?php the_content(); ?>
            </div>
            <?php  endwhile;
               else: ?>
            <p class="alignc"><?php esc_html_e( 'Sorry, but it seems we can&rsquo;t find what you&rsquo;re looking for. Try the menu above.', 'caverta' ); ?></p>
            <?php endif; ?>
         </div>
         <!--col-md-12-->
      </div>
      <!--row-->
   </div>
   <!--container-->
</section>
<?php $mt_gallery_template = get_post_meta($post->ID, "mt_gallery_template", true);
   switch ($mt_gallery_template) {
      	
   case 'mt_gallery_3cols':
          get_template_part('include/assets/gallery/gallery', '3cols');
          break;
   	
   case 'mt_gallery_4cols':
           get_template_part('include/assets/gallery/gallery', '4cols');
          break;
   	
   case 'mt_gallery_3cols_fs':
            get_template_part('include/assets/gallery/gallery', '3cols_fs');
   	 break;
   	 
   case 'mt_gallery_4cols_fs':
           get_template_part('include/assets/gallery/gallery', '4cols_fs');
   	 break;	 
   
   default:
            get_template_part('include/assets/gallery/gallery', '3cols');
   }
   
   ?>
<?php get_footer(); ?>