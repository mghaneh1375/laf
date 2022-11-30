<article id="post-<?php the_ID(); ?>" class="blog-item blog-item-1col" >
   <?php if ( has_post_thumbnail($post->ID ) ): ?>
   <a href="<?php the_permalink();?>">
      <div class="post-image">
         <?php the_post_thumbnail('full', array('class'=> 'img-fluid img-featured', 'alt' => ''.get_the_title().'', 'title' => ''.get_the_title().'')); 
            ?>
      </div>
      <!--post-image-->
   </a>
   <?php endif; ?>
   <div class="post-holder post-holder-all">
      <ul class="post-meta">
         <li class="meta-date"><?php echo get_the_date(get_option('date_format')); ?></li>
         <li class="meta-categ"><?php the_category(' '); ?></li>
         <?php if ( is_sticky() && is_home() ) : ?>
         <li class="meta-sticky"><?php esc_html_e('Featured', 'caverta'); ?></li>
         <?php endif; ?>
      </ul>
      <h2 class="article-title"><a href="<?php the_permalink() ?>"><?php the_title(); ?></a></h2>
      <div class="article-excerpt">
         <?php the_excerpt(); ?>
      </div>
      <!--post-content-->
      <a class="view-more" href="<?php the_permalink() ?>"><?php esc_html_e('Read More', 'caverta')?> </a>
   </div>
   <!--post holder-->
</article>