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
      <?php $post = $posts[0]; // Hack. Set $post so that the_date() works. ?>
      <?php /* If this is a category archive */ if (is_category()) { ?>
      <h1 class="post-title single-post-title"> <?php single_cat_title(); ?> </h1>
      <span class="post-subtitle"> <?php esc_html_e('Browsing Category', 'caverta')?> </span>
      <?php /* If this is a tag archive */ } elseif( is_tag() ) { ?>
      <h1 class="post-title single-post-title"> &#8216;<?php single_tag_title(); ?>&#8217; </h1>
      <span class="post-subtitle"> <?php esc_html_e('Browsing Tag', 'caverta')?> </span>
      <?php /* If this is a daily archive */ } elseif (is_day()) { ?>
      <h1 class="post-title single-post-title"> <?php echo get_the_date(get_option('date_format')); ?> </h1>
      <span class="post-subtitle"> <?php esc_html_e('Browsing Archives', 'caverta')?> </span>
      <?php /* If this is a monthly archive */ } elseif (is_month()) { ?>
      <h1 class="post-title single-post-title"> <?php echo get_the_date('M, Y'); ?> </h1>
      <span class="post-subtitle"> <?php esc_html_e('Browsing Archives', 'caverta')?> </span>
      <?php /* If this is a yearly archive */ } elseif (is_year()) { ?>
      <h1 class="post-title single-post-title"> <?php echo get_the_date('Y'); ?> </h1>
      <span class="post-subtitle"><?php esc_html_e('Browsing Archives', 'caverta')?> </span>
      <?php /* If this is an author archive */ } elseif (is_author()) { ?>
      <h1 class="post-title single-post-title"> <?php esc_html_e('Author Archive', 'caverta')?> </h1>
      <?php /* If this is a paged archive */ } elseif (isset($_GET['paged']) && !empty($_GET['paged'])) { ?>
      <h1 class="post-title single-post-title"> <?php esc_html_e('Blog Archives', 'caverta')?> </h1>
      <?php } ?>
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