<?php
   if ( post_password_required() ) { ?>
<p class="alert"><?php esc_html_e('This post is password protected. Enter the password to view comments.', 'caverta')?></p>
<?php
   return;
   }
   ?>
<!-- You can start editing here. -->
<section id="comments" class="comm-title">
   <?php if ( have_comments() ) : ?>
   <h5 class="widgettitle"><span><?php comments_number(esc_html__('0 Comments', 'caverta'), esc_html__('1 Comment', 'caverta'), esc_html__('% Comments', 'caverta') );?></span></h5>
   <ol class="commentlist">
      <?php wp_list_comments( array( 'callback' => 'caverta_custom_comments' )); ?>
   </ol>
   <?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : ?>
   <nav role="navigation" id="comment-nav-above" class="site-navigation comment-navigation">
      <h2 class="screen-reader-text"><?php esc_html_e( 'Comment navigation', 'caverta' ); ?></h2>
      <div class="nav-previous"><?php previous_comments_link(  esc_html__( '&larr; Older Comments', 'caverta' ) ); ?></div>
      <div class="nav-next"><?php next_comments_link( esc_html__( 'Newer Comments &rarr;', 'caverta' ) ); ?></div>
   </nav>
   <!-- /coment-nav-above -->
   <?php endif; ?>
   <?php else : // this is displayed if there are no comments so far ?>
   <?php if ( comments_open() ) : ?>
   <!-- If comments are open, but there are no comments. -->
   <?php else : // comments are closed ?>
   <!-- If comments are closed. -->
   <?php endif; ?>
   <?php endif; ?>
   <?php if ( comments_open() ) : ?>
   <div class="respond">
      <div id="comment-form-holder">
         <?php
            comment_form( array(
            	'title_reply' => '<span>'.esc_html__('Leave a Comment', 'caverta').'</span>',
            
            	'fields' => array(
            		'author' => '<div class="row"><div class="col-sm-4"><input type="text" name="author" id="author" class="comm-field"  value="" placeholder="'.esc_attr__('Name', 'caverta').'" size="22" tabindex="1"/></div>',
            		'email'  => '<div class="col-sm-4"><input type="text" name="email" id="email" class="comm-field" value="" placeholder="'.esc_attr__('Email', 'caverta').'" size="22" tabindex="2" /></div>',
            		'url'    => '<div class="col-sm-4"><input type="text" name="url" id="url" class="comm-field" value="" placeholder="'.esc_attr__('Website', 'caverta').'" size="22" tabindex="3" /></div></div>',
            	),
            	'comment_notes_before' => '',
            	'comment_field' => '<p><textarea name="comment" id="msg-contact" placeholder="'.esc_attr__('Comments', 'caverta').'" rows="7" tabindex="3"></textarea></p>',
            	'comment_notes_after' => false,
            	'label_submit'      => esc_html__( 'Post Comment', 'caverta')
            
            ) ); 
            
            ?>
         <div id="output-contact"></div>
      </div>
   </div>
   <?php endif; // if you delete this the sky will fall on your head ?>
</section>