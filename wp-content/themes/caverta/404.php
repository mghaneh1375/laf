<?php get_header(); ?>
<section class="topSingleBkg topPageBkg topPage404">
   <div class="item-img"></div>
   <div class="inner-desc">
      <h1 class="post-title single-post-title"><?php esc_html_e('404', 'caverta')?></h1>
      <span class="post-subtitle"> <?php esc_html_e('Error, Page Not Found!', 'caverta')?></span>
   </div>
</section>
<section id="wrap-content" class="blog-1col">
   <div class="container">
      <div class="row">
         <div class="col-md-12">
            <div class="error-404 layout-1col-fw">
               <p><?php esc_html_e( 'It looks like nothing was found at this location. Sorry about that.', 'caverta' ); ?></p>
               <p><a class="view-more" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e('Go To Homepage', 'caverta')?></a></p>
            </div>
         </div>
         <!--col-md-12-->
      </div>
      <!--row-->
   </div>
   <!--container-->
</section>
<!--blog-1col-->
<?php get_footer(); ?>

