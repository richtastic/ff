<?php
// combine.php
require "../php/functions.php";

echo "COMBINE.PHP\n";

$THIS_ABSOLUTE_FILE_NAME = $_SERVER["SCRIPT_FILENAME"];
$THIS_FILE_NAME = preg_replace("/.*\\//","",$THIS_ABSOLUTE_FILE_NAME);

// get input
$IMAGE_DATA_KEY = "imageData";
$FILE_NAME_KEY = "fileName";

// IMAGE DATA
$imageDataValue = parameterFromGETorPOST($IMAGE_DATA_KEY,null);
// FILE NAME
$imageDataFileNameValue = parameterFromGETorPOST($FILE_NAME_KEY,null);

// 


if(false){//$imageDataValue){ // output to file
	$binaryDataValue = base64ToBinary($imageDataValue,null);
	$fileOutName = "./temp/binary.png";
	touch($fileOutName);
	if(file_exists($fileOutName)){
		chmod($fileOutName,0775);
		$fileHandle = fopen($fileOutName,"w");
		if($fileHandle){
			fwrite($fileHandle,$binaryDataValue);
			fclose($fileHandle);
			echo "saved";
		}
	}
}else if(false){ // create canvas
	$canvasWidth = 1024;
	$canvasHeight = 128;
	$canvasFileName = "./temp/"."canvas.png";
	$result = createBlankImage($canvasWidth, $canvasHeight, $canvasFileName);
	echo "RESULT:\n";
	echo "'".$result."'";
}else{ // combine images
	$offsetX = 110;
	$offsetY = 120;
	$imageOver = "iso_gnd_stone.png";
	$imageBase = "./temp/"."canvas.png";
	$outFileName = "./temp/"."canvas2.png";
	$result = combineImageOntoImage($imageOver, $offsetX, $offsetY, $imageBase, $outFileName);

	$actual_link = requestedServerURL();
	$actual_link = preg_replace("/".$THIS_FILE_NAME."/","",$actual_link);
	$actual_link = $actual_link."".$outFileName;
	
	echo $actual_link;
}


?>