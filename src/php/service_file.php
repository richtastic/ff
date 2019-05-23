<?php
// service_file.php

require "./fw/functions.php";
//include( $_SERVER['DOCUMENT_ROOT']."./fw/files.php");
//require_once("fw/files.php");
require_once_directory("./fw");


$FILESYSTEM_LOCAL = "filesystem";


//$MY_URL_ABSOLUTE = $_SERVER['PHP_SELF'];
//$MY_URL_ABSOLUTE = $_SERVER['REQUEST_URI'];
$MY_URL_ABSOLUTE = "http://".$_SERVER["HTTP_HOST"].$_SERVER["PHP_SELF"];
$MY_URL_DIR = dirname($MY_URL_ABSOLUTE);
$MY_FILE_ABSOLUTE = __FILE__;
$MY_FILE_NAME = basename($MY_FILE_ABSOLUTE);
$MY_PATH_ABSOLUTE = dirname($MY_FILE_ABSOLUTE);
$FILESYSTEM_PATH = appendToPath($MY_PATH_ABSOLUTE, $FILESYSTEM_LOCAL);
$FILESYSTEM_URL = appendToPath($MY_URL_DIR, $FILESYSTEM_LOCAL);
//$ROOT_PATH = ;

// $COMMAND_FILE_CREATE = "file_create";
// $COMMAND_FILE_DELETE = "file_delete";
// $COMMAND_FILE_APPEND = "file_append";
// $COMMAND_FILE_READ = "file_read";
// $COMMAND_FILE_LIST = "file_list";
// 	$PARAMETER_FILE_NAME = "file_name";
// 	$PARAMETER_FILE_DATA = "file_data";


$PARAM_OPERATION = "unknown";
$INDEX = "operation";
if(array_key_exists($INDEX,$_POST)){
	$PARAM_OPERATION = $_POST[$INDEX];
}


$PARAM_PATH = null;
$INDEX = "path";
if(array_key_exists($INDEX,$_POST)){
	$PARAM_PATH = $_POST[$INDEX];
}


$PARAM_OFFSET = null;
$INDEX = "offset";
if(array_key_exists($INDEX,$_POST)){
	$PARAM_OFFSET = $_POST[$INDEX];
}

$PARAM_COUNT = null;
$INDEX = "count";
if(array_key_exists($INDEX,$_POST)){
	$PARAM_COUNT = $_POST[$INDEX];
}

$PARAM_DATA = null;
$INDEX = "data";
if(array_key_exists($INDEX,$_POST)){
	$PARAM_DATA = $_POST[$INDEX];
}

$OPERATION_TYPE_HELLO = "hello";
$OPERATION_TYPE_READ = "read";
$OPERATION_TYPE_WRITE = "write";
$OPERATION_TYPE_DELETE = "delete";
$OPERATION_TYPE_MOVE = "move";




$payload = [];

$success = false;
if($PARAM_OPERATION==$OPERATION_TYPE_HELLO){
	//NOOP
}else if($PARAM_OPERATION==$OPERATION_TYPE_READ){
	$fileExists = false;
	if($PARAM_PATH!=null){
		$absolutePath = appendToPath($FILESYSTEM_PATH, $PARAM_PATH);
		$fileExists = file_exists($absolutePath);
		$path = trimDirectoryPrefix($FILESYSTEM_PATH,$absolutePath);
		$payload["path"] = $path;
		if($fileExists){
			$isDirectory = is_dir($absolutePath);
			if($isDirectory){
				$name = "/";
				if($path!="/"){
					$name = basename($path);
				}
				$payload["name"] = $name;
				$payload["isDirectory"] = true;
				$array = [];
				getDirectoryListingLinear($absolutePath,$array, 1, $FILESYSTEM_PATH);
				$payload["contents"] =& $array;
				$success = true;
			}else{
				$array = [];
				getDirectoryListingLinear($absolutePath,$array, 1, $FILESYSTEM_PATH);
				if($PARAM_OFFSET!=null && $PARAM_COUNT!=null){
					$handle = fopen($absolutePath,"r");
					if($PARAM_OFFSET>0){
						fseek($handle, $PARAM_OFFSET);
					}
					$size = filesize($absolutePath);
					$readCount = min([$PARAM_COUNT, $size-$PARAM_OFFSET]);
					$data = fread($handle, $readCount);
					fclose($handle);
					//
					$data64 = base64_encode($data);
					$info = [];
					$info["offset"] = $PARAM_OFFSET;
					$info["count"] = $readCount;
					$info["base64"] = $data64;
					$payload =& $array[0];
					$payload["data"] = $info;
					$success = true;
				}
			}
		}
	}
	if(!$fileExists){
		$payload["exists"] = "false";
	}
}else if($PARAM_OPERATION==$OPERATION_TYPE_WRITE){

// _www
// $processUser = posix_getpwuid(posix_geteuid());
// echo($processUser['name']);


	$absolutePath = appendToPath($FILESYSTEM_PATH, $PARAM_PATH);
	$fileExists = file_exists($absolutePath);
	$path = trimDirectoryPrefix($FILESYSTEM_PATH,$absolutePath);
	if($PARAM_OFFSET!=null && $PARAM_COUNT!=null){
		$payload["path"] = $path;
		if($PARAM_DATA!=null){
			$payload["i64"] = $PARAM_DATA;
			$dataBinary = base64_decode($PARAM_DATA);
			if($fileExists){
				$size = filesize($absolutePath);
				$payload["size"] = $size;
				$payload["info"] = "append";
				$handle = null;
				if($PARAM_OFFSET==0){
					//$removed = removeFileAtLocation($absolutePath);
					$handle = fopen($absolutePath, 'wb'); // OVERWRITE with binary
				}else{
					$handle = fopen($absolutePath, 'ab'); // append with binary
				}
				if($handle){
					$moved = fseek($handle, $PARAM_OFFSET);
					if($moved==0){
						$written = fwrite($handle, $dataBinary);
						$payload["count"] = $written;
						if($written==$PARAM_COUNT){
							$success = true;
						}else{
							$payload["error"] = "write count not match: ".$count." ".$written."";
						}
					}else{
						$payload["error"] = "could not seek";
					}
					fclose($handle);
				}else{
					$payload["error"] = "not open";
				}
			}else{
				if($PARAM_OFFSET==0){
					$payload["info"] = "create";
					// if($fileExists){ // delete and rewrite from 0
					// 	$removed = removeFileAtLocation($absolutePath);
					// }
					$parentPath = dirname($absolutePath);
					// $payload["A"] = $parentPath;
					// $payload["B"] = $absolutePath;
					$parentExists = file_exists($parentPath);
					if(!$parentExists){ // need to create container for file
						createDirectoryAtLocation($parentPath, true);
					}
					$handle = fopen($absolutePath, 'wb'); // write with binary
					if($handle){
						$written = fwrite($handle, $dataBinary);
						fclose($handle);
						//0755 ???
						setFilePermissionsReadOnly($absolutePath);
						$payload["count"] = $written;
						if($written==$PARAM_COUNT){
							$success = true;
						}else{
							$payload["error"] = "write count not match";
						}
					}else{
						$payload["error"] = "not open";
					}
				}else{
					$payload["error"] = "new file should have offset 0";
				}
			}
		}
	}else{
		$payload["path"] = $path;
		if(!$fileExists){
			$payload["isDirectory"] = true;
			$result = createDirectoryAtLocation($absolutePath, true);
			if($result){
				//setFilePermissionsReadOnly($absolutePath);
				$success = true;
			}
		}else{ // already exists
			$isDirectory = is_dir($absolutePath);
			$payload["isDirectory"] = $isDirectory ? true : false;
			if($isDirectory){
				$success = true;
			}
		}
	}
}else if($PARAM_OPERATION==$OPERATION_TYPE_DELETE){
	$absolutePath = appendToPath($FILESYSTEM_PATH, $PARAM_PATH);
	$fileExists = file_exists($absolutePath);
	$path = trimDirectoryPrefix($FILESYSTEM_PATH,$absolutePath);
	$payload["path"] = $path;
	if($fileExists){
		$isDirectory = is_dir($absolutePath);
		if($isDirectory){
			$result = removeFileAtLocation($absolutePath, true);
			if($result){
				$success = true;
			}
		}else{
			$result = removeFileAtLocation($absolutePath);
			if($result){
				$success = true;
			}
		}
	}else{
		$payload["error"] = "path not exist";
	}
}else if($PARAM_OPERATION==$OPERATION_TYPE_MOVE){
	/*
	$absolutePath = appendToPath($FILESYSTEM_PATH, $PARAM_PATH);
	$fileExists = file_exists($absolutePath);
	$path = trimDirectoryPrefix($FILESYSTEM_PATH,$absolutePath);
	$payload["path"] = $path;
	if($fileExists){
		$isDirectory = is_dir($absolutePath);
		if($isDirectory){
			$result = removeFileAtLocation($absolutePath, true);
			if($result){
				$success = true;
			}
		}else{
			$result = removeFileAtLocation($absolutePath);
			if($result){
				$success = true;
			}
		}
	}else{
		$payload["error"] = "path not exist";
	}*/
	$payload["error"] = "not implemented";
}





$response = [];
$response["operation"] = $PARAM_OPERATION;
$response["result"] = $success ? "success" : "failure";
$response["payload"] = $payload;

header("Content-Type: application/json");

echo json_encode($response);

/*

# linux
chown -R www-data:www-data /path/to/webserver/www
# mac
chown -R _www:_www /path/to/webserver/www


chmod -R g+rw /path/to/webserver/www

*/

?>
