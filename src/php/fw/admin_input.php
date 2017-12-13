<?php
// admin_input.php

error_log("ADMIN INPUT");


global $wpdb;
error_log("wpdb: ".print_r($wpdb));

//header("Location: ");


/*

https://codex.wordpress.org/Custom_Fields#PostMeta_Functions
https://developer.wordpress.org/reference/functions/get_post_meta/



*/
/*
http://www.makeuseof.com/tag/tutorial-ajax-wordpress/
*/
/*
https://www.sitepoint.com/handling-post-requests-the-wordpress-way/
*/


/*
global $wpdb;
$table_name = $wpdb->prefix . "simple_prods_six";

$name=$_POST['name'];
$price=$_POST['price'];
$text=$_POST['text'];
$imgurl=$_POST['imgurl'];

$insert = "INSERT INTO " . $table_name .
            " (name, text, price, imgurl) " .
            "VALUES ('$name','$text','$price','$imgurl')";
$results = $wpdb->query( $insert );

print "Your information has been successfully added to the database.";
*/


// https://wordpress.org/support/topic/write-to-database-from-form-in-a-plugin





/*
https://www.inkthemes.com/how-you-can-easily-create-customized-form-in-wordpress/

<form name="customer_details" method="POST" onsubmit="return form_validation()" action="../customer-details.php">
Your Name: <input type="text" id="customer_name" name="customer_name" /><br />
Your Email: <input type="text" id="customer_email" name="customer_email" /><br />
Sex: <input type="radio" name="customer_sex" value="male">Male <input type="radio" name="customer_sex" value="female">Female<br />
Your Age: <input type="text" id="customer_age" name="customer_age" /><br />
<input type="submit" value="Submit"/>
</form>




https://blog.samelh.com/2015/08/13/create-mysql-database-table-wordpress-insert-data-wpdb-html-form/



$post_id = wp_insert_post($new_post);
$url = get_permalink( $post_id );
wp_redirect($url);
exit();



https://premium.wpmudev.org/blog/wordpress-plugin-development-guide/?utm_expid=3606929-84.YoGL0StOSa-tkbGo-lVlvw.0&utm_referrer=https%3A%2F%2Fwww.google.com%2F

add_action( 'wp_head', 'my_facebook_tags' );
function my_facebook_tags() {
  echo 'I am in the head section';
}


https://www.sitepoint.com/build-your-own-wordpress-contact-form-plugin-in-5-minutes/

add_shortcode( 'sitepoint_contact_form', 'cf_shortcode' );





*/
?>