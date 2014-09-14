<?php
// base64data.php
// curl -verbose -X POST --data "data=..." http://localhost/.../base64data.php > image.png

$PARAM_CONTENT_TYPE = "type";
$PARAM_CONTENT_DATA = "data";

// get input
$base64content = $_GET[$PARAM_CONTENT_TYPE];
$base64string = $_GET[$PARAM_CONTENT_DATA];
if(!$base64string){ // try POST
	$base64content = $_POST[$PARAM_CONTENT_TYPE];
	$base64string = $_POST[$PARAM_CONTENT_DATA];
}

if($base64string){
	// find content type if not set
	if(!$base64content){
		preg_match("/data:(.*);base64,/",$base64string,$base64match);
		if($base64match){
			$base64content = $base64match[1];
		}else{
			$base64content = "unknown/unknown";
		}
	} // sanitize http header?

	// determine return info
	$base64string = preg_replace("/.*base64,/","",$base64string);
	$base64data = base64_decode($base64string);
	$base64size = strlen($base64data);

	// return as binary
	header("Content-Type: ".$base64content);
	header("Content-Length: ".$base64size);
	echo $base64data;
	exit;
}else{
	echo "no content";
}
?>