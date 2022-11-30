<?php get_header(); ?>

<?php $mt_sidebar_single = get_theme_mod( 'mt_sidebar_single', 'mt_sidebar_single_right'); ?>

<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'full' ); ?>


<section class="topSingleBkg topPostBkg">  

<div class="item-img" <?php if(!empty($image)):?> style="background-image:url('<?php echo esc_url($image[0]); ?>');" <?php endif;?>></div>

  <div class="inner-desc">	 
  
 <h1 class="post-title single-post-title"><?php the_title(); ?></h1>
 
 <ul class="post-meta">

<li class="meta-date"><?php echo get_the_date(get_option('date_format')); ?></li>
<li class="meta-categ"><?php the_category(' '); ?></li>

<?php $author_id = $post->post_author; ?>

<li class="meta-categ meta-author"><?php esc_html_e('By ', 'caverta'); the_author_meta( 'display_name', $author_id  ); ?></li>

</ul>
 
 	</div>

</section>

<section id="wrap-content" class="blog-post-single">

<div class="container">

<div class="row">

<?php if ( $mt_sidebar_single != 'mt_sidebar_single_no' ): ?>

<div class="col-md-9 <?php if ( $mt_sidebar_single == 'mt_sidebar_single_left' ): ?> posts-holder-push-right <?php else: ?> posts-holder <?php endif; ?>">

<?php else: ?>

<div class="col-md-12 page-full">

<?php endif; ?>

<?php if ( $mt_sidebar_single == 'mt_sidebar_single_no' ): ?> <div class="layout-1col-fw"> <?php endif;?>

<?php 

	if (have_posts()) : while (have_posts()) : the_post(); 
	
	$classes_post = array('blog-item-1col','single-post-holder');
		
?>

<article id="post-<?php the_ID(); ?>" <?php post_class($classes_post); ?> >

<div class="post-content single-post-content clearfix">

<?php the_content(); ?>

</div><!--post-content-->

<?php
        wp_link_pages(array(
            'before' => '<div class="page-links">',
            'after' => '</div>',
            'nextpagelink' => '<span class="next-page">'.esc_html__('Next Page', 'caverta').'</span>',
            'previouspagelink' => '<span class="previous-page">'.esc_html__('Previous Page', 'caverta').'</span>',
            'next_or_number' => 'next'
        ));
?>

<?php if(has_tag()): ?>
<div class="tags-single-page">
  <?php the_tags('',' ', ''); ?>
</div><!--tags-single-page-->
  <?php endif; ?>
  
<?php $authordesc = get_the_author_meta( 'description' );

	if ( ! empty ( $authordesc ) ):
	
 ?>  

<div class="author-single-page clearfix">

<div class="author-avatar"> <?php echo get_avatar( get_the_author_meta( 'user_email' ), '100' ); ?>  </div>

<div class="author-content">

<h4><a href="<?php echo esc_url(get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>"> <?php the_author_meta( 'display_name' ); ?></a></h4>

<div class="author-text"> <?php the_author_meta( 'description' ); ?> </div>

</div><!--author-content-->
      
</div><!--author-single-page-->

<?php endif; ?>

<div class="row meta-nav-holder">

<div class="col-md-6 meta-nav">

<div class="pn-holder">

 <?php $prevPost = get_previous_post();
 
 if( !empty($prevPost)):
 
 $prevthumbnail = wp_get_attachment_image_src( get_post_thumbnail_id( $prevPost->ID ), 'caverta-image600x500' );
 
					if( !empty($prevthumbnail)):?>
					
					<div class="pn-img">
					<a href="<?php echo get_permalink( $prevPost->ID ); ?>">
                    					
					<img class="img-fluid" src="<?php echo esc_url($prevthumbnail[0]); ?>" alt="<?php echo esc_attr__('Previous Image','caverta'); ?>"/>
					
                    </a>
                    </div>
	              <?php endif; endif; ?>  


<?php previous_post_link('<div class="pn-desc"><div class="meta-nav-subtitle">' . esc_html__( '&larr; previous post', 'caverta' ) . '</div><h3>%link</h3></div>','%title'); ?> 

</div>
</div>

<div class="col-md-6 meta-nav meta-nav-right">

<div class="pn-holder">

<?php next_post_link('<div class="pn-desc"><div class="meta-nav-subtitle">' . esc_html__( 'next post &rarr;', 'caverta' ) . '</div><h3>%link</h3> </div>','%title'); ?>

 <?php $nextPost = get_next_post();
 
 if( !empty($nextPost)):
 
 $nextthumbnail = wp_get_attachment_image_src( get_post_thumbnail_id( $nextPost->ID ), 'caverta-image600x500' );
 
					if( !empty($nextthumbnail)):?>
					<div class="pn-img">
					<a href="<?php echo get_permalink( $nextPost->ID ); ?>">
                    <?php  ?>
					
					<img class="img-fluid" src="<?php echo esc_url($nextthumbnail[0]); ?>" alt="<?php echo esc_attr__('Next Image','caverta'); ?>"/>
					
                    </a>
                    </div>
	              <?php endif; endif; ?>  

</div>

</div>

</div><!--meta-nav-holder-->

</article>

<?php  endwhile;

else: ?>

<p class="alignc"><?php esc_html_e( 'Sorry, but it seems we can&rsquo;t find what you&rsquo;re looking for. Try the menu above.', 'caverta' ); ?></p>

<?php endif; ?>

<?php if ( comments_open() || get_comments_number() ) {	comments_template(); } ?>

</div>

<?php  if ( $mt_sidebar_single == 'mt_sidebar_single_no' ):  ?>

</div>

<?php else: ?>

<?php get_sidebar(); ?>

<?php endif; ?>


</div><!--row-->
</div><!--container-->

</section>

<?php get_footer(); ?>