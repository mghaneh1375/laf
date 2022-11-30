<?php if ( is_active_sidebar( 'footer-one' ) ): ?>
		<div class="footer-widgets">
			<div class="row">
				<div class="col-sm-12">
					<div class="foo-block">
						<?php dynamic_sidebar('footer-one'); ?>
					</div>
					<!--foo-block-->
				</div>
				<!--col-lg-12-->
			</div>
			<!--row-->
		</div>
<?php endif; ?>