<?php
// images.php

include_once "functions.php";


function getDirectoryListingRecursive($directory,& $array, $limit){
	if($limit==null){
		$limit = 2;
	}
	if($limit<=0){
		return;
	}
	$list = scandir($directory);
	$i;
	$len = count($list);
	for($i=0; $i<$len; ++$i){
		$item = $list[$i];
		if($item == "." || $item == ".."){
			continue;
		}
		$path = $item;
		$path = realpath($directory."/".$path);
		$size = filesize($path);
		$isDir = is_dir($path);
		$entry = [
			"name" => $item, // end
			"path" => $path, // absolute
			"size" => $size, // bytes
			"isDirectory" => $isDir, // 0 | 1
			"directories" => $isDir ? [] : null // nested arrays
		];
		array_push($array, $entry);
		echo str_pad("",(10-$limit)*6*2,"&nbsp;").$item."  "."<br/>";//.$isDir."'<br/>";
		if($isDir){
			getDirectoryListingRecursive($entry["path"], $entry["directories"], --$limit);
		}
		// getDirectoryListingRecursive($directory, $array){
	}
	return $array;
}


$array = [];
$directory = "../3DR";
getDirectoryListingRecursive($directory, $array, null);

//print_r($array);

//echo "hai";

?>