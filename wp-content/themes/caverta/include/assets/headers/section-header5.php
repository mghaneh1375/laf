<?php 
      $mt_social_facebook_url = get_theme_mod( 'mt_social_facebook_url');
      $mt_social_twitter_url = get_theme_mod( 'mt_social_twitter_url');
      $mt_social_instagram_url = get_theme_mod( 'mt_social_instagram_url');
      $mt_social_linkedin_url = get_theme_mod( 'mt_social_linkedin_url');
      $mt_social_pinterest_url = get_theme_mod( 'mt_social_pinterest_url');  
      $mt_social_trip_url = get_theme_mod( 'mt_social_trip_url');  
      $mt_social_youtube_url = get_theme_mod( 'mt_social_youtube_url'); 
      $mt_social_vimeo_url = get_theme_mod( 'mt_social_vimeo_url');
      $mt_social_dribbble_url = get_theme_mod( 'mt_social_dribbble_url');  
      $mt_social_skype_url = get_theme_mod( 'mt_social_skype_url');   
	  $mt_social_email_url = get_theme_mod( 'mt_social_email_url');	
      ?>
   <div class="menu-mask"></div>
   <!-- /menu-mask -->
   <div class="mobile-menu-holder">
      <div class="modal-menu-container">
         <div class="exit-mobile">
            <span class="icon-bar1"></span>
            <span class="icon-bar2"></span>
         </div>
         <?php if (has_nav_menu('primary-menu')) {
            wp_nav_menu(array('theme_location' => 'primary-menu', 'menu_class' => 'menu-mobile', 'container' => 'false'));
            
            }   ?>
      </div>
	  
	  <div class="menu-contact">
		
	   <?php $mt_header_btn = get_theme_mod( 'mt_header_btn', '');
            if (!empty($mt_header_btn) ):
			?>
            <div class="mobile-btn">
            <?php echo wp_kses_post( $mt_header_btn ); ?>
            </div>
           <?php  endif; ?>
		
	  
         <?php $mt_mobile_info = get_theme_mod( 'mt_mobile_info');
            if (!empty($mt_mobile_info) ):
            
            echo wp_kses_post( $mt_mobile_info ); 
            
            endif; ?>
         <ul class="social-media">
           <?php if (!empty($mt_social_facebook_url) ): ?>
            <li><a class="social-facebook" href="<?php echo esc_url($mt_social_facebook_url);?>" target="_blank"><i class="fab fa-facebook-f"></i></a></li>
            <?php endif; ?>
            <?php if (!empty($mt_social_twitter_url) ): ?>
            <li><a class="social-twitter" href="<?php echo esc_url($mt_social_twitter_url);?>" target="_blank"><i class="fab fa-twitter"></i></a></li>
            <?php endif; ?>
			<?php if (!empty($mt_social_instagram_url) ): ?>
            <li><a class="social-instagram" href="<?php echo esc_url($mt_social_instagram_url);?>" target="_blank"><i class="fab fa-instagram"></i></a></li>
            <?php endif; ?>
            <?php if (!empty($mt_social_pinterest_url) ): ?>
            <li><a class="social-pinterest" href="<?php echo esc_url($mt_social_pinterest_url);?>" target="_blank"><i class="fab fa-pinterest"></i></a></li>
            <?php endif; ?>
            <?php if (!empty($mt_social_trip_url) ): ?>
            <li><a class="social-tripadvisor" href="<?php echo esc_url($mt_social_trip_url);?>" target="_blank"><i class="fab fa-tripadvisor"></i></a></li>
            <?php endif; ?>
			<?php if (!empty($mt_social_linkedin_url) ): ?>
            <li><a class="social-linkedin" href="<?php echo esc_url($mt_social_linkedin_url);?>" target="_blank"><i class="fab fa-linkedin"></i></a></li>
            <?php endif; ?>
            <?php if (!empty($mt_social_youtube_url) ): ?>
            <li><a class="social-youtube" href="<?php echo esc_url($mt_social_youtube_url);?>" target="_blank"><i class="fab fa-youtube"></i></a></li>
            <?php endif; ?>
            <?php if (!empty($mt_social_vimeo_url) ): ?>
            <li><a class="social-vimeo" href="<?php echo esc_url($mt_social_vimeo_url);?>" target="_blank"><i class="fab fa-vimeo-square"></i></a></li>
            <?php endif; ?>
            <?php if (!empty($mt_social_dribbble_url) ): ?>
            <li><a class="social-dribbble" href="<?php echo esc_url($mt_social_dribbble_url);?>" target="_blank"><i class="fab fa-dribbble"></i></a></li>
            <?php endif; ?>
            <?php if (!empty($mt_social_skype_url) ): ?>
            <li><a class="social-skype" href="<?php echo esc_url($mt_social_skype_url);?>" target="_blank"><i class="fab fa-skype"></i></a></li>
            <?php endif; ?>
			<?php if (!empty($mt_social_email_url) ): ?>
		<li><a class="social-email" href="mailto:<?php echo esc_url($mt_social_email_url);?>" target="_blank"><i class="far fa-envelope"></i></a></li>
		<?php endif; ?>
         </ul>
      </div>
      <!-- /menu-contact-->
   </div>
   <!-- /mobile-menu-holder-->
   
   
   
   <header class="headerHolder5">
      
	<div class="header-5">
   
      <div class="nav-button-holder">
         <?php if (has_nav_menu('primary-menu')) { ?>
         <button type="button" class="nav-button">
         <span class="icon-bar"></span>
         </button>
         <?php } ?>
      </div>
      <!--nav-button-holder-->
	  
	  <?php $mt_header_info = get_theme_mod( 'mt_header_info');

		if (!empty($mt_header_info) ): ?>
		

		<div class="binfo header5-left">
		
            <?php echo wp_kses_post( $mt_header_info ); ?>
			
		</div>
   
   <?php endif; ?>
	  
      <?php 	$mt_logo_img = get_theme_mod( 'custom_logo' );
         $mt_logo_img_url = wp_get_attachment_image_src( $mt_logo_img , 'full' );
           
          if (!empty($mt_logo_img)):
         ?>
      <div class="logo logo-5"><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><img class="img-fluid" src="<?php echo esc_url($mt_logo_img_url[0]); ?>" width="<?php echo esc_attr($mt_logo_img_url[1]); ?>" height="<?php echo esc_attr($mt_logo_img_url[2]); ?>" alt="<?php bloginfo('name'); ?>" /></a></div>
      <?php else: ?>
      <div class="logo logo-5">
         <div class="logo-txt"><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php bloginfo('name'); ?></a></div>
      </div>
      <?php endif; ?>
	  
	  <div class="btn-header">
         <?php if (!empty($mt_header_btn) ):
            
            echo wp_kses_post( $mt_header_btn ); 
            
            endif; ?>
      </div>
 	  
	 </div> 
	 
	  <nav class="nav-holder nav-holder-5">

		<ul id="signInDiv">
                        <li class="hidden signInBtn" id="signInBtn"><a href="/pages/login">Sign In</a></li>

                        <div id="userInfoNav" class="hidden mr-auto nav-item dropdown">
                            <a aria-haspopup="true" aria-expanded="false" id="menu-nav-dropdown" onclick="toggleDropBox()" class="dropdown-toggle nav-link" role="button"></a>
                            <div aria-labelledby="menu-nav-dropdown" class="dropdown-menu hidden">
                                <a class="dropdown-item" href="/pages/history">My Orders</a>
                                <a onclick="logout()" class="dropdown-item">Sign Out</a>
                            </div>
                        </div>
                </ul>

         <?php if (has_nav_menu('primary-menu')) {
            wp_nav_menu(array('theme_location' => 'primary-menu', 'menu_class' => 'menu-nav menu-nav-5', 'container' => 'false'));
            
            }   ?>
      </nav>

</header>
