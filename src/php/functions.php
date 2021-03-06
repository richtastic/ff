<?php
// functions.php

function IS_SERVER_OSX(){
	$command = 'uname -a';// Darwin
	$value = shell_exec($command);
	$matchesDarwin = preg_match("/darwin/i",$value);
	if(count($matchesDarwin)>0){
		if(strlen($matchesDarwin[0])>0){
			return true;
		}
	}
	return false;
}
function IS_SERVER_LINUX(){
	$command = 'uname -o'; // GNU/Linux
	$value = shell_exec($command);
	//echo "VALUE: '".$value."'";
	$matchesLinux = preg_match("/linux/i",$value);
	$matchesCount = count($matchesLinux);
	if($matchesCount>0){
		// echo "2: '".$matchesCount."'";
		// echo "1: '".$matchesLinux[0]."'";
		// if(strlen($matchesLinux[0])>0){
			return true;
		//}
	}
	return false;
}

// DEFAULT OSX
$GLOBALS['BIN_LOCATION_COMPOSITE'] = "/usr/local/bin/composite";
$GLOBALS['BIN_LOCATION_CONVERT'] = "/usr/local/bin/convert";
$GLOBALS['BIN_LOCATION_IDENTIFY'] = "/usr/local/bin/identify";

if(IS_SERVER_LINUX()){
$GLOBALS['BIN_LOCATION_COMPOSITE'] = "/usr/bin/composite";
$GLOBALS['BIN_LOCATION_CONVERT'] = "/usr/bin/convert";
$GLOBALS['BIN_LOCATION_IDENTIFY'] = "/usr/bin/identify";
}

function BIN_LOCATION_COMPOSITE(){
	return $GLOBALS['BIN_LOCATION_COMPOSITE'];
}
function BIN_LOCATION_CONVERT(){
	return $GLOBALS['BIN_LOCATION_CONVERT'];
}
function BIN_LOCATION_IDENTIFY(){
	return $GLOBALS['BIN_LOCATION_IDENTIFY'];
}

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

function base64ToBinary($data64,$type=null) {
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

// function createBlankImage($canvasWidth, $canvasHeight, $canvasFileName){
// 	$convertLocation = "/usr/local/bin/convert";
// 	$command = $convertLocation." -size ".$canvasWidth."x".$canvasHeight." xc:transparent ".$canvasFileName." 2>&1 ";
// 	$result = shell_exec($command);
// 	return $result;
// }

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

function combineMultipleImagesOntoSingleImage($imageWidth, $imageHeight, & $subImageList, $filename){ // faster than combineImageOntoImage
	$command = BIN_LOCATION_CONVERT().' -size '.$imageWidth.'x'.$imageHeight.' xc:"rgba(255,255,255,255)" ';
	foreach($subImageList as $index => $image){
		$file = $image['filename'];
		$offsetX = $image['x'];
		$offsetY = $image['y'];
		$width = $image['width'];
		$height = $image['height'];
		$signX = $offsetX < 0 ? '-' : '+';
		$signY = $offsetY < 0 ? '-' : '+';
		$command = $command . $file . ' -geometry '.$signX.abs($offsetX).$signY.abs($offsetY).'  -composite ';
	}
	$command = $command . '  ' . $filename;
	$result = shell_exec($command);
	return $result;
}

function createBlankImage($location,$width=null,$height=null,$background=null){
	if(!isset($width)) {
		$width = 1;
	}
	if(!isset($height)) {
		$height = 1;
	}
	if(!isset($background)){
		$background = 0x00000000;
	}
	$command = BIN_LOCATION_CONVERT().' -size '.$width.'x'.$height.' xc:"'.hexARGBToRGBAString($background).'" '.$location;
	$result = shell_exec($command);
	return $result;
}

function hexARGBToRGBAString($hex){
	$a = ($hex>>24) & 0xFF;
	$r = ($hex>>16) & 0xFF;
	$g = ($hex>>8) & 0xFF;
	$b = ($hex>>0) & 0xFF;
	return "rgba(".$r.",".$g.",".$b.",".$a.")";
}

function cropImage($imageSourceFilename, $offsetX, $offsetY, $cropWidth, $cropHeight, $imageDestinationFilename){ // if result is invalid image => returns original image
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