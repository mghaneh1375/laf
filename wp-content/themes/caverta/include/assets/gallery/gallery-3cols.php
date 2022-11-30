<?php $mt_gallery_images = get_field('mt_gallery_images');
   if(!empty($mt_gallery_images)):
   
   ?>
<section class="gallery-container">
   <div class="container">
      <div class="row">
         <div class="col-md-12">
            <div class="gallery-holder gallery-3cols">
               <?php foreach ( $mt_gallery_images as $piece ):	?>
               <div class="gallery-post">
                  <a href="<?php echo esc_url($piece['url']); ?>" class="lightbox" title="<?php echo esc_attr($piece['caption']); ?>">
                     <div class="gallery-img" style="background-image:url('<?php if(!empty($piece['url'])) echo esc_url($piece['url']); ?>');"></div>
                     <div class="gallery-desc">
                        <div class="gallery-view"><i class="fa fa-eye"></i></div>
                     </div>
                  </a>
               </div>
               <?php endforeach; ?>
            </div>
         </div>
         <!--col-md-12-->
      </div>
      <!--row-->
   </div>
   <!--container-->
</section>
<?php endif; ?>