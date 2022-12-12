<?php
/**
 * Plugin Name:     Wp Create React App Concept
 * Plugin URI:      PLUGIN SITE HERE
 * Description:     PLUGIN DESCRIPTION HERE
 * Author:          YOUR NAME HERE
 * Author URI:      YOUR SITE HERE
 * Text Domain:     wp-create-react-app-concept
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * @package         Wp_Create_React_App_Concept
 */


// Setting react app path constants.
define('RP_PLUGIN_VERSION','0.1.0' );
define('RP_PLUGIN_DIR_URL', plugin_dir_url( __FILE__ ) . 'react-app/');
define('RP_REACT_APP_BUILD', RP_PLUGIN_DIR_URL . 'build/');
define('RP_MANIFEST_URL', RP_REACT_APP_BUILD . 'asset-manifest.json');

/**
 * Calling the plugin class with parameters.
 */
function rp_load_plugin(){
	// Loading the app in WordPress admin main screen.
//	new RpLoadReactApp('admin_enqueue_scripts', 'index.php', false,'#wpbody .wrap');
	// Loading the app WordPress front end page.
	$page_slug = trim( $_SERVER["REQUEST_URI"] , '/' );
	$page_slug = explode("/", $page_slug);

	if ( $page_slug[0] == "contact-us-2") {
//		wp_enqueue_style(
//      			'wpse_89494_style_2',
//		        get_template_directory_uri() . '/my.css'
//    		);
	}
	else if ( $page_slug[0] == "pages") {
		new RpLoadReactApp( 'wp_enqueue_scripts', '', '#wrap-content');

		wp_enqueue_style(
      			'wpse_89494_style_1',
		        get_template_directory_uri() . '/react.css?v=' . time()
    		);


		if(count($page_slug) > 1 && $page_slug[1] == "booking")
			wp_enqueue_style(
      				'wpse_89495_style_1',
		        	get_template_directory_uri() . '/booking.css?v=' . time()
	    		);
		else
			wp_enqueue_style(
      				'wpse_89496_style_1',
			        get_template_directory_uri() . '/menu.css?v=' . time()
	    		);

		ob_start();
		get_header();
		$header = ob_get_clean();
		if(count($page_slug) > 1 && $page_slug[1] == "booking")
			$header = preg_replace('#<title>(.*?)<\/title>#', '<title>Booking | La Fiorentina</title>', $header);
		else
			$header = preg_replace('#<title>(.*?)<\/title>#', '<title>Menu | La Fiorentina</title>', $header);

		echo $header;
	}
}

add_action('init','rp_load_plugin');


/**
 * Class RpLoadReactApp.
 */
class RpLoadReactApp {

	/**
	 * @var string
	 */
	private $selector = '';
	/**
	 * @var string
	 */
	private $limit_load_hook = '';

	/**
	 * RpLoadReactApp constructor.
	 *
	 * @param string $enqueue_hook Hook to enqueue scripts.
	 * @param string $limit_load_hook Limit load to hook in admin load. If front end pass empty string.
	 * @param bool|string $limit_callback Limit load by callback result. If back end send false.
	 * @param string $css_selector Css selector to render app.
	 */
	function __construct( $enqueue_hook, $limit_load_hook, $css_selector)  {
		$this->selector = $css_selector;
		$this->limit_load_hook = $limit_load_hook;

		add_action( $enqueue_hook, [$this,'load_react_app']);
	}

	/**
	 * Load react app files in WordPress admin.
	 *
	 * @param $hook
	 *
	 * @return bool|void
	 */
	function load_react_app( $hook ) {


		// Get assets links.
		$assets_files = $this->get_assets_files();

		$js_files  = array_filter( $assets_files,  fn($file_string) => pathinfo( $file_string, PATHINFO_EXTENSION ) === 'js');
		$css_files  = array_filter( $assets_files,  fn($file_string) => pathinfo( $file_string, PATHINFO_EXTENSION ) === 'css');

		// Load css files.
		foreach ( $css_files as $index => $css_file ) {
			wp_enqueue_style( 'react-plugin-' . $index, RP_REACT_APP_BUILD . $css_file );
		}

		// Load js files.
		foreach ( $js_files as $index => $js_file ) {
			wp_enqueue_script( 'react-plugin-' . $index, RP_REACT_APP_BUILD . $js_file, array(), RP_PLUGIN_VERSION, true );
		}

		// Variables for app use - These variables will be available in window.rpReactPlugin variable.
		wp_localize_script( 'react-plugin-0', 'rpReactPlugin',
			array( 'appSelector' => $this->selector )
		);
	}

	/**
	 * Get app entry points assets files.
	 *
	 * @return bool|void
	 */
	private function get_assets_files(){
		// Request manifest file.
		$request = file_get_contents( RP_MANIFEST_URL );

		// If the remote request fails.
		if ( !$request  )
			return false;

		// Convert json to php array.
		$files_data = json_decode( $request );
		if ( $files_data === null )
			return;

		// No entry points found.
		if ( ! property_exists( $files_data, 'entrypoints' ) )
			return false;

		return $files_data->entrypoints;
	}
}
