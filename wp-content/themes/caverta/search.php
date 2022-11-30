<?php get_header(); ?>
<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( get_option('page_for_posts') ), 'full' ); ?>
<?php $mt_page_title =  get_post_meta(get_option('page_for_posts'), "mt_page_title", true);
   $mt_page_subtitle = get_post_meta(get_option('page_for_posts'), "mt_page_subtitle", true);
   $blog_page_title = get_the_title(get_option('page_for_posts'));
   $mt_page_top_imgh = get_post_meta(get_option('page_for_posts'), "mt_page_top_imgh", true);
   
   ?>
<section class="topSingleBkg topPageBkg topArchive" <?php if(!empty($mt_page_top_imgh)):?> style="height:<?php echo esc_attr( $mt_page_top_imgh ); ?>" <?php endif; ?>>
   <div class="item-img" <?php if(!empty($image)):?> style="background-image:url('<?php echo esc_url($image[0]); ?>');" <?php endif;?>></div>
   <div class="inner-desc">
      <h1 class="post-title single-post-title">  "<?php the_search_query(); ?>" </h1>
      <span class="post-subtitle"> <?php esc_html_e('Search Results', 'caverta');?> </span>
   </div>
</section>
<?php $mt_sidebar = get_theme_mod( 'mt_sidebar', 'mt_sidebar_right'); ?>
<div class="container blog-holder">
<div class="row">
   <?php if ( $mt_sidebar != 'mt_sidebar_no' ): ?>
   <div class="col-md-9 <?php if ( $mt_sidebar == 'mt_sidebar_left' ): ?> posts-holder-push-right <?php else: ?> posts-holder <?php endif; ?>">
      <?php else: ?>
      <div class="col-md-12">
         <?php endif; ?>
         <?php
            $mt_home_articles_layout = get_theme_mod( 'mt_home_articles_layout', 'mt_home_articles_layout_1col_list_left');
            
            	switch ($mt_home_articles_layout) {
            	
            	case 'mt_home_articles_layout_1col':
                    get_template_part('include/assets/layouts/layout', '1col');
                    break;
            	case 'mt_home_articles_layout_2col_grid':
                    get_template_part('include/assets/layouts/layout', '2col_grid');
                    break;
            	case 'mt_home_articles_layout_3col_grid':
                    get_template_part('include/assets/layouts/layout', '3col_grid');
                    break;	
            	case 'mt_home_articles_layout_1col_list_left':
                    get_template_part('include/assets/layouts/layout', '1col_list_left');
                    break;			
            			
            		
            	default:
                     get_template_part('include/assets/layouts/layout', '2col_grid');
            }
            
            ?>
      </div>
      <?php  if ( $mt_sidebar != 'mt_sidebar_no' ):  ?>
      <?php get_sidebar(); ?>
      <?php endif; ?>
   </div>
   <!--row-->
</div>
<!--container-->
<?php get_footer(); ?>