<?php if ( is_active_sidebar( 'footer-one' ) || is_active_sidebar( 'footer-two' ) || is_active_sidebar( 'footer-three' ) || is_active_sidebar( 'footer-four' ) ): ?>
      <div class="footer-widgets">
         <div class="row">
            <div class="col-md-3">
               <div class="foo-block">
                  <?php dynamic_sidebar('footer-one'); ?>
               </div>
               <!--foo-block-->
            </div>
            <!--col-md-3-->
            <div class="col-md-3">
               <div class="foo-block">
                  <?php dynamic_sidebar('footer-two'); ?>
               </div>
               <!--foo-block-->
            </div>
            <!--col-md-3-->
            <div class="col-md-3">
               <div class="foo-block">
                  <?php dynamic_sidebar('footer-three'); ?>
               </div>
               <!--foo-block-->
            </div>
            <!--col-md-3-->
            <div class="col-md-3">
               <div class="foo-block foo-last">
                  <?php dynamic_sidebar('footer-four'); ?>
               </div>
               <!--foo-block-->
            </div>
            <!--col-md-3-->
         </div>
         <!--row-->
      </div>
      <?php endif; ?>