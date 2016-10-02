<?php
// images.php

include_once "functions.php";


function getDirectoryListingRecursive($directory,&$array,$limit){
	if($limit==null){
		$limit = 10;
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
		$arr  = [];
		$entry = [];
		$entry["name"] = $item; // end
		$entry["path"] = $path; // absolute
		$entry["size"] = $size; // bytes
		$entry["isDirectory"] = $isDir ? true : false;
		$entry["contents"] =& $arr;// : null;
		array_push($array, $entry);
		if($isDir){
			getDirectoryListingRecursive($entry["path"], $arr, $limit-1);
		}
		unset($entry);
		unset($arr);
	}
}

function printDirectoryListing(& $array, $depth = 0){
	$len = count($array);
	//echo "count: ".$len."<br>";
	for($i=0; $i<$len; ++$i){
		$entry = $array[$i];
		if(!$entry){
			continue;
		}
		$isDir = $entry["isDirectory"];
		$path = $entry["path"];
		$size = $entry["size"];
		$name = $entry["name"];
		$pad = str_pad("",($depth)*6*12,"&nbsp;");
		if($isDir){
			echo $pad."".$name."/<br/>";
		}else{
			echo $pad."".$name."    (".$size.")<br/>";
		}
		if($isDir){
			printDirectoryListing($entry["contents"], $depth+1);
		}
		
	}
}


//echo exec('whoami');

function relativePathToAbsolutePath($root, $relative){
	echo $root."<br/>";
	echo $relative."<br/>";
	$relative = preg_replace('/\/\.\.\//', '/', $relative);
	echo $relative."<br/>";
	$absolutePath = $root."/".$relative;
	echo $absolutePath."<br/>";
	$absolutePath = realpath($absolutePath);
	echo $absolutePath."<br/>";
	return $absolutePath;
}

$result = relativePathToAbsolutePath("/tmp/php","bacon.png");

exit(0);


$array = [];
$directory = "../3DR";
getDirectoryListingRecursive($directory, $array, null);
printDirectoryListing($array, 0);

// echo "<pre>";
// print_r($array);
// echo "</pre>";
// echo "<br/><br/>";





/*

function recursive(&$array, $i=3){
	if($i==3){
		$item = ["A" => 1, "B" => 2, "C" => 3, "array" => []];
		array_push($array,$item);
		recursive($item["array"], $i-1);
	}else if($i==2){
		$item = ["A" => 1, "B" => 2, "array" => []];
		array_push($array,$item);
		recursive($item["array"], $i-1);
	}else if($i==1){
		$item = ["A" => 1, "array" => []];
		array_push($array,$item);
		recursive($item["array"], $i-1);
	}else if($i==0){
		$item = ["array" => []];
		array_push($array,$item);
		recursive($item["array"], $i-1);
	}
	return $array;
}

*/



/*
function recursive(&$array, $i=3){
	$item = null;
	$arr = [];
	if($i==3){
		$item = ["A" => 1, "B" => 2, "C" => 3, "array" => &$arr];
		array_push($array,$item);
		recursive($arr, $i-1);
	}else if($i==2){
		$item = ["A" => 1, "B" => 2, "array" => []];
		array_push($array,$item);
		recursive($item["array"], $i-1);
	}else if($i==1){
		$item = ["A" => 1, "array" => []];
		array_push($array,$item);
		recursive($item["array"], $i-1);
	}else if($i==0){
		$item = ["array" => []];
		array_push($array,$item);
		recursive($item["array"], $i-1);
	}
	return $array;
}

$array = [];
echo "<pre>";
print_r($array);
echo "</pre>";
echo "<br/><br/>";

recursive($array);
echo "<pre>";
print_r($array);
echo "</pre>";
echo "<br/><br/>";
*/


/*
expecting:
Array(
	[0] => 	Array (
		[A] => 1
	 	[B] => 2
	 	[C] => 3
	 	[array] => Array (
			[A] => 1
	 		[B] => 2
			[array] => Array (
				[A] => 1
				[array] => Array (
					[array] => Array ()
				)
		 	)
		 )
	) 
)
*/







?>