<?php
// files.php



function moveTempFileToLocation($root, $source, $relativeDestination=null, $filename=null, $overwrite=true){
	if(file_exists($root)){
		error_log("A: ".$root." - ".$source." : ".$relativeDestination." - ".$filename);
		if(file_exists($source)){
			error_log("B");
			$absoluteDestination = null;
			if($relativeDestination!==null){
				$absoluteDestination = relativePathToAbsolutePath($root,$relativeDestination);
				error_log("C   ".$absoluteDestination);
			}else{
				error_log("D");
				$absoluteDestination = $root;
			}
			if($filename===null || strlen($filename)==0){
				error_log("E");
				$filename = "FILE_".uniqid();// tempnam($absoluteDestination,"FILE_");
			}
			error_log("F: ".$filename);
			$absoluteDestination = relativePathToAbsolutePath($absoluteDestination, $filename);
			error_log("G: ".$absoluteDestination);
			$destinationAlreadyExists = file_exists($absoluteDestination);
			if($destinationAlreadyExists && !$overwrite){
				error_log("G");
				return false;
			}
			error_log("G: ".$source." -> ".$absoluteDestination);
			$moved = move_uploaded_file($source, $absoluteDestination);
			if($moved){
				setFilePermissionsReadOnly($absoluteDestination);
				return true;
			}
		}
		//
	}
	return false;
}


function appendToPath($path,$next){
	$concat = null;
	if(substr($concat,-1)=="/"){
		$concat = "";
	}else{
		$concat = "/";
	}
	return $path.$concat.$next;
}

function moveFileToRelativeLocation($root, $relativeSource, $relativeDestination){

}

function createDirectoryAtLocation($absolutePath){
	$parentPath = dirname($absolutePath);
	if(file_exists($parentPath)){
		if(!file_exists($absolutePath)){ // already exists
			$didMakeDirectory = mkdir($absolutePath, 0755, false); // 0644
			if($didMakeDirectory){
				return true;
			}
		}
	}
	return false;
}

function relativePathToAbsolutePath($root, $relative){
	//$relative = preg_replace('/\/\.\.\//', '/', $relative);
	$absolutePath = $root."/".$relative;
	//$absolutePath = realpath($absolutePath); // returns FALSE for future files
	$absolutePath = preg_replace('/\/\.\.\//', '/', $absolutePath); // remove up-directories
	$absolutePath = preg_replace('/(\/)+/', '/', $absolutePath); // collapse multiple slashes
	return $absolutePath;
}

function relativePathByRemovingPrefix($path, $prefix){
	if(substr($path, 0, strlen($prefix)) == $prefix) {
		return substr($path, strlen($prefix));
	}
	return "";
}

function setFilePermissionsReadOnly($path){
	chmod($path,0644); // rw- | r-- | r--
}


function removeFileAtLocation($absolutePath, $deleteIfDir=true){
	if(file_exists($absolutePath)){
		$isDir = is_dir($absolutePath);
		if($isDir && $deleteIfDir){
			// RECURSIVELY REMOVE FILE CONTENTS IF NOT EMPTY
			$fileList = scandir($absolutePath);
			foreach ($fileList as $index => $file){
				if($file!=="." && $file!==".."){
					$path = realpath($absolutePath."/".$file);
					removeFileAtLocation($path, $deleteIfDir);
				}
			}
			// REMOVE SELF
			$didRemoveDirectory = rmdir($absolutePath);
			if($didRemoveDirectory){
				return true;
			}
		}else{
			$didRemoveFile = unlink($absolutePath);
			if($didRemoveFile){
				return true;
			}
		}
	}
	return false;
}


function createDirectoryIfNotExist($absolutePath, $mode=0777){
	if(!$absolutePath){
		return;
	}
	if(!file_exists($absolutePath)){
		mkdir($absolutePath, $mode, true);
	}
}


function getDirectoryListingRecursive($directory,&$array,$limit=null, $trim=null, $fxn=null){
	// $directory = $directory."/"; // end with slash
	// $directory = preg_replace('/(\/)+/', '/', $directory);
	// directory nonempty
	if(!$directory){
		return;
	}
	if(!file_exists($directory)){
		return;
	}
	if($limit===null){
		$limit = 10;
	}
	if($limit<=0){
		return;
	}
	$isDir = is_dir($directory);
	$list = null;
	if($isDir){
		$list = scandir($directory);
	}else{
		$file = basename($directory);
		$list = [$file];
		$directory = dirname($directory);
	}
	$i;
	$len = count($list);
	for($i=0; $i<$len; ++$i){
		$item = $list[$i];
		if($item == "." || $item == ".."){
			continue;
		}
		$path = $item;
		$path = realpath($directory."/".$path); // ($directory."".$path);//
		//error_log("PATH: ".$path."       ==========");
		$size = filesize($path);
		$isDir = is_dir($path);
		$mimetype = $isDir ? "directory" : mime_content_type($path);
		$arr = [];
		$entry = [];
		$entry["name"] = $item; // end
		$entry["path"] = $path; // absolute
		$entry["isDirectory"] = $isDir ? true : false;
		if($isDir){
			$entry["contents"] =& $arr;// : null;
		}else{
			$entry["mimetype"] = $mimetype;
			$entry["size"] = $size; // bytes
			//$entry["contents"] = null;
		}
		if($fxn!=null){
			$fxn($entry);
		}
		if($trim){ // remove prefix
			$path = trimDirectoryPrefix($trim, $path);
			// redo
			$entry["path"] = $path; // relative
		}
		array_push($array, $entry);
		if($isDir){
			getDirectoryListingRecursive($entry["path"], $arr, $limit-1, $trim, $fxn);
		}
		unset($entry);
		unset($arr);
	}
}
function trimDirectoryPrefix($trim, $path){
	if($trim){
		$pattern = preg_quote("".$trim."");
		$path = preg_replace("#^".$pattern."?#", "", $path);
		$path = str_replace("//", "/", $path);
	}
	return $path;
}
function getDirectoryListingLinear($directory,&$array,$limit=null, $trim=null, $fxn=null){
	$temp = [];
	getDirectoryListingRecursive($directory,$temp,$limit, $trim, $fxn);
	addListingLinear($array, $temp);
}
function addListingLinear(&$destination, &$source){
	$i;
	$len = count($source);
	for($i=0; $i<$len; ++$i){
		$entry =& $source[$i];
		$destination[] =& $entry;
		if($entry["isDirectory"]){
			addListingLinear($destination, $entry["contents"]);
		}
		unset($entry);
	}
}

function removeContentsInDirectory($absolutePath){
	if(!$absolutePath){ return 0; }
//function removeFileAtLocation($absolutePath, $deleteIfDir=true){
//function getDirectoryListingRecursive($directory,&$array,$limit=null, $trim=null, $fxn=null){
	$array = [];
	getDirectoryListingRecursive($absolutePath,$array, 1);
	error_log("contents length: ".count($array));
	$i;
	$len = count($array);
	$deleteCount = 0;
	for($i=0; $i<$len; ++$i){
		$entry = $array[$i];
		$path = $entry["path"];
		error_log("  path: ".$path);
		$removed = removeFileAtLocation($path);
		if($removed){
			$deleteCount += 1;
		}
	}
	return $deleteCount;
}



?>
