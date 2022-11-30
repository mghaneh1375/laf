<?php $mt_sidebar = get_theme_mod( 'mt_sidebar', 'mt_sidebar_right');

	if ( $mt_sidebar == 'mt_sidebar_no' ):
 ?>

<section id="wrap-content" class="blog-3col-grid">

<?php 

	$count = 0;	
	
	if (have_posts()) : while (have_posts()) : the_post(); 
	
	$classes_post = array('blog-item','blog-item-3col-grid');
	
	if ($count % 3 == 0): ?> <div class="row"> <?php endif; ?>
    
<div class="col-md-4">

<article id="post-<?php the_ID(); ?>" <?php post_class($classes_post); ?> >

<?php if ( has_post_thumbnail($post->ID ) ): ?>

<a href="<?php the_permalink();?>">

<div class="post-image">

<?php the_post_thumbnail('caverta-image600x500', array('class'=> 'img-fluid img-featured', 'alt' => ''.get_the_title().'', 'title' => ''.get_the_title().'')); 

 ?>

</div>

</a>

<?php endif; ?>

<div class="post-holder post-content content-grid">

<ul class="post-meta">

<li class="meta-date"><?php echo get_the_date(get_option('date_format')); ?></li>
<li class="meta-categ"><?php the_category(' '); ?></li>

<?php if ( is_sticky() && is_home() ) : ?>

<li class="meta-sticky"><?php esc_html_e('Featured', 'caverta'); ?></li>
	
<?php endif; ?>

</ul>

<h2 class="article-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>

<div class="article-excerpt"><?php echo wp_trim_words( get_the_excerpt(), 30, ' ...' ); ?></div>

<a class="view-more" href="<?php the_permalink(); ?>"><?php esc_html_e('Read More', 'caverta')?> </a>

</div><!--post-content-->

</article>

</div>

 <?php $count++; if(($count % 3) == 0) {?> </div><!--end row--> <?php }?>

<?php endwhile;

if(($count % 3) == 1 || ($count % 3) == 2 ) {?> </div><!--end row--> <?php } ?>

<?php else: ?>

<div class="row">

<div class="col-md-12 alignc nothing-found">

<h2><?php esc_html_e( 'NOTHING FOUND', 'caverta' ); ?></h2>

<div class="nf-text"><?php esc_html_e( 'Sorry, but it seems we can&rsquo;t find what you&rsquo;re looking for. Try a new search or the menu above.', 'caverta' ); ?></div>

<?php get_search_form(); ?>

</div>

</div>

<?php endif; ?>

<?php

 if(function_exists('caverta_pagenavi') ) : ?>

	<?php caverta_pagenavi();  ?>
       
	<?php else : ?>

  <ul class="other-entries">
			<li class="newer-entries"><span><?php previous_posts_link(esc_html__('&larr; Prev', 'caverta')) ?></span></li>
            <li class="older-entries"><span><?php next_posts_link(esc_html__('Next &rarr;', 'caverta')) ?></span></li>
          </ul>
      
<?php endif; ?>

</section><!--blog-3col-->

<?php else: ?>

<div class="row">

<div class="col-md-10 col-md-offset-1 alignc nothing-found">

<h2><?php esc_html_e( '3 Columns Grid', 'caverta' ); ?></h2>

<div class="nf-text"><?php esc_html_e( 'This layout only works in full width mode. Go to Appearance > Customize > General Options > Blog - Sidebar Display and choose the Full Width option', 'caverta' ); ?></div>

</div>

</div>

<?php endif; ?>