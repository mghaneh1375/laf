<?php $mt_gallery_images = get_field('mt_gallery_images');
   if(!empty($mt_gallery_images)):
   
   ?>
<section class="gallery-container gallery-container-fs">
   <div class="gallery-holder gallery-3cols gallery-3cols-fs">
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
</section>
<?php endif; ?>