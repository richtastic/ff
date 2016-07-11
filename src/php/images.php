<?php
// images.php

include_once "functions.php";

$COMMAND_UPLOAD = "upload";
$COMMAND_COMBINE = "combine";

$command = $_POST["command"];
$data = $_POST["data"];
$filename = $_POST["filename"];
if(!$filename){
	$filename = "out.png";
}

// phpinfo();
//echo "MAC: ".IS_SERVER_OSX();
//return;


if($command==$COMMAND_UPLOAD){
	if(!$data){
		echo "no data";
		return;
	}
	$binaryFile = base64ToBinary($data);

	$outputFilename = "./temp/".$filename;
	//$saved = file_put_contents($outputFilename, $binaryFile);
	$fileHandle = fopen($outputFilename,"w");
	$saved = fwrite($fileHandle,$binaryFile);
	fclose($fileHandle);
	echo "saved: ".$saved;
	return;
}

if($command==$COMMAND_COMBINE){
	if(!$data){
		echo "no data";
		return;
	}
	$json = json_decode($data);
	$fileDirectoryPrefix = "./temp/";

	$imageFinalLocation = $fileDirectoryPrefix.$json->filename;
	$fullImageSizeX = $json->width;
	$fullImageSizeY = $json->height;
	$imageList = $json->images;

	createBlankImage($imageFinalLocation, $fullImageSizeX, $fullImageSizeY);
	
	// combine cells
	$len = count($imageList);
	for($i=0; $i<$len; ++$i){
		$imageObject = $imageList[$i];
		$filename = $fileDirectoryPrefix.$imageObject->filename;
		$imageWidth = $imageObject->width;
		$imageHeight = $imageObject->height;
		$offsetX = $imageObject->x;
		$offsetY = $imageObject->y;
		combineImageOntoImage($filename, $offsetX, $offsetY, $imageFinalLocation, $imageFinalLocation);
	}
	return;
}

echo "COMMAND: '".$command."'";
return;

$data = '{"json":123}';


// echo hexARGBToRGBAString(0xFF998822);
// return;

//echo $data;

//$imageSourceFilename, $offsetX, $offsetY, $cropWidth, $cropHeight, $imageDestinationFilename){ // if result is invalid image => returns original image
	// $cropWidth = 100;
	// $cropHeight = 60;
	// $offsetX = 413;
	// $offsetY = 100;
	// $imageSourceFilename = "../3DR/images/catHat.jpg";
	// $imageDestinationFilename = "./temp/"."temp.png";

$sourceGridImageLocation = "../3DR/images/catHat.jpg";
$dimensions = dimensionOfImage($sourceGridImageLocation);
if($dimensions!=null){
	$width = $dimensions["width"];
	$height = $dimensions["height"];
	$gridSizeWidth = 150;
	$gridSizeHeight = 150;
	$cols = ceil($width/$gridSizeWidth);
	$rows = ceil($width/$gridSizeHeight);
	$imageGridFileList = array();
	for($j=0; $j<$rows; ++$j){
		for($i=0; $i<$cols; ++$i){
			$imagePrefix = "temp_";
			$imageType = "png";
			$join = 'x';
			$imageFull = $imagePrefix.$j.$join.$i.'.'.$imageType;
			// cut image i,j
			$imageLocation = "./temp/".$imageFull;
			$offsetX = $gridSizeWidth * $i;
			$offsetY = $gridSizeHeight * $j;
			cropImage($sourceGridImageLocation, $offsetX,$offsetY, $gridSizeWidth,$gridSizeHeight, $imageLocation);
			$finalSize = dimensionOfImage($imageLocation);
			$finalWidth = $finalSize["width"];
			$finalHeight = $finalSize["height"];
			// record entry
			$imageObject = [];
			$imageObject["x"] = $offsetX;
			$imageObject["y"] = $offsetY;
			$imageObject["width"] = $finalWidth;
			$imageObject["height"] = $finalHeight;
			$imageObject["filename"] = $imageLocation;
			array_push($imageGridFileList, $imageObject);
		}
	}
	
	// COMBINE IMAGES INTO GRID
	$len = sizeof($imageGridFileList);
	$imageGridFinalLocation = "./temp/"."grid.png";

	// get final image size
	$fullGridSizeX = 0;
	$fullGridSizeY = 0;
	for($i=0; $i<$len; ++$i){
		$imageObject = $imageGridFileList[$i];
		$filename = $imageObject["filename"];
		$imageWidth = $imageObject["width"];
		$imageHeight = $imageObject["height"];
		$offsetX = $imageObject["x"];
		$offsetY = $imageObject["y"];
		$fullGridSizeX = max($fullGridSizeX, $offsetX + $imageWidth);
		$fullGridSizeY = max($fullGridSizeY, $offsetY + $imageHeight);
	}
	echo "<br/>GRID SIZE: ".$fullGridSizeX .", ". $fullGridSizeY."<br/>";
	createBlankImage($imageGridFinalLocation, $fullGridSizeX, $fullGridSizeY);
echo "<br/>".$imageGridFinalLocation;
	// combine cells
	for($i=0; $i<$len; ++$i){
		$imageObject = $imageGridFileList[$i];
		$filename = $imageObject["filename"];
		$imageWidth = $imageObject["width"];
		$imageHeight = $imageObject["height"];
		$offsetX = $imageObject["x"];
		$offsetY = $imageObject["y"];
		combineImageOntoImage($filename, $offsetX, $offsetY, $imageGridFinalLocation, $imageGridFinalLocation);
	}
	
	//combineImageOntoImage($imageOver, $offsetX, $offsetY, $imageBase, $outFileName)

}


?>