<?php
// functions.php

function BIN_LOCATION_COMPOSITE(){
	return "/usr/local/bin/composite";
}
function BIN_LOCATION_CONVERT(){
	return "/usr/local/bin/convert";
}
function BIN_LOCATION_IDENTIFY(){
	return "/usr/local/bin/identify";
}


// $GLOBALS['BIN_LOCATION_CONVERT'] = "/usr/local/bin/convert";
// echo $GLOBALS['BIN_LOCATION_CONVERT'];

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
	
	$command = BIN_LOCATION_COMPOSITE()." -geometry ".$offsetX.$offsetY." ".$imageOver." ".$imageBase."  ".$outFileName." 2>&1 ";
	$result = shell_exec($command);
	return $result;
}


function splitImageIntoGridImages($imageSourceFilename, $offsetX, $offsetY, $cropWidth, $cropHeight, $imageDestinationFilename){ // if result is invalid image => returns original image
	// $cropWidth = 100;
	// $cropHeight = 60;
	// $offsetX = 413;
	// $offsetY = 100;
	// $imageSourceFilename = "../3DR/images/catHat.jpg";
	// $imageDestinationFilename = "./temp/"."temp.png";
	$command = BIN_LOCATION_CONVERT().' -crop '.$cropWidth.'x'.$cropHeight.'+'.$offsetX.'+'.$offsetY.'  '.$imageSourceFilename.'  '.$imageDestinationFilename;
	$result = shell_exec($command);
	return $result;
}


function dimensionOfImage($imageSourceFilename){
	$command = BIN_LOCATION_IDENTIFY().' -format "%[fx:w]x%[fx:h]"'.'  '.$imageSourceFilename;
	//$result = $command;
	$result = shell_exec($command);
	if( strlen($result)>0 ){
		$width = preg_replace('/x.*/i', "", $result);
		$height = preg_replace('/.*x/i', "", $result);
		$width = intval($width);
		$height = intval($height);
		return ["width"=>$width, "height"=>$height];
	}
	return null;
}

?>