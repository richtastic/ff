<?php
// images.php

require "functions.php";

$data = '{"json":123}';

//echo $data;

//$imageSourceFilename, $offsetX, $offsetY, $cropWidth, $cropHeight, $imageDestinationFilename){ // if result is invalid image => returns original image
	// $cropWidth = 100;
	// $cropHeight = 60;
	// $offsetX = 413;
	// $offsetY = 100;
	// $imageSourceFilename = "../3DR/images/catHat.jpg";
	// $imageDestinationFilename = "./temp/"."temp.png";

//for(){}
$dimensions = dimensionOfImage("../3DR/images/catHat.jpg");
if($dimensions!=null){
$width = $dimensions["width"];
$height = $dimensions["height"];
//echo $width.'x'.$height;

	$gridSizeWidth = 150;
	$gridSizeHeight = 150;
	$cols = ceil($width/$gridSizeWidth);
	$rows = ceil($width/$gridSizeHeight);
	for($j=0; $j<$rows; ++$j){
		for($i=0; $i<$cols; ++$i){
		$imagePrefix = "temp_";
		$imageType = "png";
		$join = 'x';
		$imageFull = $imagePrefix.$j.$join.$i.'.'.$imageType;
		//echo "GRID: ".$cols;
		echo $imageFull;
		echo "<br/>";
		$offsetX = $gridSizeWidth * $i;
		$offsetY = $gridSizeHeight * $j;
		splitImageIntoGridImages("../3DR/images/catHat.jpg", $offsetX,$offsetY, $gridSizeWidth,$gridSizeHeight, "./temp/".$imageFull);
		}
	}
}

//echo splitImageIntoGridImages("../3DR/images/catHat.jpg", 90,140, 100,50, "./temp/"."temp.png");

?>