<?php
// imageCORS.php
// cross origin resource sharing
// http://php.net/manual/en/function.curl-getinfo.php

$PARAM_CONTENT_URL = "url";

// get input
$sourceURL = $_GET[$PARAM_CONTENT_URL];
if(!$sourceURL){ // try POST
	$sourceURL = $_POST[$PARAM_CONTENT_URL];
}


if($sourceURL){
	$tempFileName = "temp.temp";
	//$command = "curl -X GET \"".$sourceURL."\" > ".$tempFileName;
	$curl = curl_init($sourceURL);
	curl_setopt($curl,CURLOPT_HEADER,0);
	curl_setopt($curl,CURLOPT_RETURNTRANSFER,1);
	curl_setopt($curl,CURLOPT_BINARYTRANSFER,1);
	$data = curl_exec($curl);
	$returnCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
	$contentType = curl_getinfo($curl, CURLINFO_CONTENT_TYPE);
	$contentLength = curl_getinfo($curl, CURLINFO_CONTENT_LENGTH_DOWNLOAD);
	//$contentHeader = curl_getinfo($curl);
	//$contentType = $contentHeader[];
	curl_close($curl);
	if($returnCode!=200){
		header("Status-Code: "." ".$returnCode);
		exit;
	}
	header("Content-Type: ".$contentType);
	header("Content-Length: ".$contentLength);
	// sanitize?
	echo $data;
	exit;
}else{
	echo "no content";
}
?>