<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'laf' );

/** MySQL database username */
define( 'DB_USER', 'wp2' );

/** MySQL database password */
define( 'DB_PASSWORD', '123456' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          'O#W}54/GbIWBJ!kJe_.77ceB^<3sd *S4HfsCzQhla}~3)ZNzLQa`EFy|Fl;9Bf&' );
define( 'SECURE_AUTH_KEY',   ':aR,vo<x4iyDD?d;Q2DLs;!oyp/:~bMG[QGj3Z7+qDnG!U@r4fn|K 57u58c9y? ' );
define( 'LOGGED_IN_KEY',     'zE~H+sCO]>P8X</JW!bG+>?=))xZf$8-TyE)xWh|~wKf~w:sbKj;x4D{C7GnOQHc' );
define( 'NONCE_KEY',         '9wsLd!U~:j~-gB:}Ts-<pY>vd.:2kU(UBsMs/S>Q>$Cy1l{v~agJLR%n)pN@R-LQ' );
define( 'AUTH_SALT',         'y fio=Kao:ZNr?;*wOv8u)kgj$;pMlInBh-msZOxGr<50aAHWWgo4?vcQ}(2S`7$' );
define( 'SECURE_AUTH_SALT',  'hj(i@A+yBPCjs]bZhe*DwWg.Nu-%!f5@1ZDIG_<@vz8AuAC5)M?_d6j= NcifYuM' );
define( 'LOGGED_IN_SALT',    'wZ7.ZzHJtE4S!e=y=/V2u%.Cb9{+,e *bkSv%3s8)AC* ]l(9qugiBlC=kG KU*T' );
define( 'NONCE_SALT',        'HVGgLnhL6mZl&tTyXp3j#Sxg-(AOgEZK9(}8a1Z8D],`A)-9Miv%q81R*K3g47ZE' );
define( 'WP_CACHE_KEY_SALT', 'Al mu7We(Ji~0`Fkn,A.>:GFMl~w}R>huPgSf}k2DlC`i(%_^uNLiFpay 77-q,r' );

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';




/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );
}

define( 'WP_DEBUG', true );

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
