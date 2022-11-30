<?php if ( is_active_sidebar( 'footer-one' ) || is_active_sidebar( 'footer-two' ) ): ?>
		<div class="footer-widgets">
			<div class="row">
				<div class="col-sm-6">
					<div class="foo-block">
						<?php dynamic_sidebar('footer-one'); ?>
					</div>
					<!--foo-block-->
				</div>
				<!--col-lg-6-->
				<div class="col-sm-6">
					<div class="foo-block foo-last">
						<?php dynamic_sidebar('footer-two'); ?>
					</div>
					<!--foo-block-->
				</div>
				<!--col-lg-6-->
			</div>
			<!--row-->
		</div>
<?php endif; ?>