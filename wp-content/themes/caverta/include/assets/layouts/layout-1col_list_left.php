<section id="wrap-content" class="blog-1col-list-left">

<?php if (have_posts()) : while (have_posts()) : the_post(); 
	
    $classes_post = array('blog-item','blog-item-1col-list');
		
?>

<article id="post-<?php the_ID(); ?>" <?php post_class($classes_post); ?> >

<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'caverta-image600x500' ); ?>

<?php if(!empty($image)): ?>

<div class="post-image">
<a href="<?php the_permalink();?>">
<div class="list-image" style="background-image:url('<?php echo esc_url($image[0]); ?>');"></div>
</a>
</div><!--post-image-->

<?php endif; ?>

<div class="post-holder <?php if(empty($image)):?> post-holder-noimg <?php endif; ?>">

<ul class="post-meta">

<li class="meta-date"><?php echo get_the_date(get_option('date_format')); ?></li>
<li class="meta-categ"><?php the_category(' '); ?></li>

<?php if ( is_sticky() && is_home() ) : ?>

<li class="meta-sticky"><?php esc_html_e('Featured', 'caverta'); ?></li>
	
<?php endif; ?>

</ul>

<h2 class="article-title"><a href="<?php the_permalink() ?>"><?php the_title(); ?></a></h2>

<div class="article-excerpt">
<?php echo wp_trim_words( get_the_excerpt(), 40, ' ...' ); ?>
</div>

<a class="view-more" href="<?php the_permalink() ?>"><?php esc_html_e('Read More', 'caverta')?> </a>

</div><!--post holder-->

</article>

<?php endwhile;

else: ?>

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

</section><!--blog-1col-->