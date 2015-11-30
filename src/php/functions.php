<?php
// functions.php


function requestedServerURL(){
	$actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
	$actual_link = preg_replace("/\\?.*/","",$actual_link); // remove GET params
	return $actual_link;
}

function parameterFromGETorPOST($key,$default){
	$imageDataValue = $default;
	if(!$imageDataValue){
		$imageDataValue = $_GET[$key];
	}
	if(!$imageDataValue){
		$imageDataValue = $_POST[$key];
	}
	return $imageDataValue;
}

function base64ToBinary($data64,$type) {
	$base64content = $type;
	$base64string = $data64;
	if($base64string){ // find content type if not set
		if(!$base64content){
			preg_match("/data:(.*);base64,/",$base64string,$base64match);
			if($base64match){
				$base64content = $base64match[1];
			}else{
				$base64content = "unknown/unknown";
			}
		}
		// determine return info
		$base64string = preg_replace("/.*base64,/","",$base64string);
		$base64data = base64_decode($base64string);
		$base64size = strlen($base64data);
		return $base64data;
	}else{
		return null;
	}
}

function createBlankImage($canvasWidth, $canvasHeight, $canvasFileName){
	$convertLocation = "/usr/local/bin/convert";
	$command = $convertLocation." -size ".$canvasWidth."x".$canvasHeight." xc:transparent ".$canvasFileName." 2>&1 ";
	$result = shell_exec($command);
	return $result;
}

function combineImageOntoImage($imageOver, $offsetX, $offsetY, $imageBase, $outFileName){
	if($offsetX>=0){
		$offsetX = "+".$offsetX;
	}else{
		$offsetX = "-".$offsetX;
	}
	if($offsetY>=0){
		$offsetY = "+".$offsetY;
	}else{
		$offsetY = "-".$offsetY;
	}

	$compositeLocation = "/usr/local/bin/composite";
	$command = $compositeLocation." -geometry ".$offsetX.$offsetY." ".$imageOver." ".$imageBase."  ".$outFileName." 2>&1 ";
	$result = shell_exec($command);
	return $result;
}

?>