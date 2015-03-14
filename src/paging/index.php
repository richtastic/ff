<?php
// index.php

function directoryListing($sourceDirectory, $ofType){ // '/(png|jpg)$/'
	$fileList = array();
	if( is_dir($sourceDirectory) ){
		$directory = opendir($sourceDirectory);
		if($directory){
			$entry = readdir($directory);
			while($entry){
				$path = $sourceDirectory."/".$entry;
				if(is_file($path)){
					if ($ofType==null || preg_match($ofType, $entry) ) {
						array_push($fileList, $entry);
					}
				}
				$entry = readdir($directory);
			}
			closedir($directory);
		}
	}
	return $fileList;

}
// CONFIG PARAMETERS
$thisFileFileName = __FILE__;
$thisFileFileName = basename($thisFileFileName);

$pageIndex = $_GET["i"] ? $_GET["i"] : "0";
$pageIndex = intval($pageIndex);

// FIND IMAGE LIST
$extensionRegex = '/\.(png|jpg|jpeg|gif)$/';
$sourceDirectory = "./images";

$fileList = directoryListing($sourceDirectory,$extensionRegex);
sort($fileList);
$len = sizeof($fileList);

if($len==0){
	echo "no entries";
	exit(1);
}

// PAGE NAVIGATION
$pageIndex = $pageIndex%$len;
$imageFilename = $fileList[$pageIndex];
$imageName = $sourceDirectory."/".$imageFilename;

$prevPageIndex = ($pageIndex-1)>=0 ? ($pageIndex-1) : ($len-1);
$nextPageIndex = ($pageIndex+1)%$len;

$prevPageURL = './'.$thisFileFileName.'?i='.$prevPageIndex;
$nextPageURL = './'.$thisFileFileName.'?i='.$nextPageIndex;

?>
<head>
<title></title>
</head>

<body style="margin:0; padding:0; background-color:#000; ">

<div style="position:absolute; width:100%; height:100%; z-index:999;" name="buttons">
	<a href="<?php echo $prevPageURL; ?>">
		<div style="position:relative; float:left; width:50%; height:100%; background-color:rgba(255,0,0,0.0)" name="left"></div>
	</a>
	<a href="<?php echo $nextPageURL; ?>">
		<div style="position:relative; float:left; width:50%; height:100%; background-color:rgba(0,255,0,0.0)" name="right"></div>
	</a>
</div>
<div style="position:absolute; width:100%; height:100%; text-align:center;" name="content">
	<img src="<?php echo $imageName; ?>" style="height:100%; position:relative; display:inline-block; margin:0 auto; max-width:100%; ">
</div>

</body>


