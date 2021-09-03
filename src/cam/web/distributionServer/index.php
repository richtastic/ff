<?php

// camera public cdn / distribution service


$path = "";
if(isset($_GET["path"])){
	$path = $_GET["path"];
}

// echo $path;
// http://localhost/web/ff/cam/web/distributionServer/index.php?path=%2Fcamera%2F0%2Fimage


$matches = [];

// /camera/0/image
// $matchCameraImage = preg_match('\/camera\/(.*)\/(.*)',$path,$matches);
// $matchCameraImage = preg_match("/camera/",$path,$matches);

// $matchCameraImage = preg_match("/\/camera\/^(\/)(.*)\/^(\/)(.*)/",$path,$matches);

//$matchCameraImage = preg_match("/\/camera\/([^\/]*)\/([^\/]*)/",$path,$matches);

//echo "count(matches): ".count($matches);
// echo "count($matches): ".($matches);

$pathList = explode('/',$path);

// echo "path: ".count($pathList);

/*if( strlen($pathList[0])==0 ){
	array_shift($pathList);
}*/

for($i=0; $i<count($pathList); ++$i){
//	echo "path: ".($pathList[$i]);
	if(strlen($pathList[$i])==0){
		array_splice($pathList,$i,1);
		--$i;
	}
}

//echo "<br/>path: ".count($pathList);

/*
echo "path: ".($pathList[0]);
echo "path: ".($pathList[1]);
echo "path: ".($pathList[2]);
*/


if( count($pathList)>0 && $pathList[0]=="camera" ){
//	echo "<br/>camera path";
	$cameraID = $pathList[1];
//	echo "<br/>camera ID: ".$cameraID;
	$cameraOperation = $pathList[2];
//	echo "<br/>camera OP: ".$cameraOperation;



	$imagePath = './images/test.jpg';
	$fileType = pathinfo($path, PATHINFO_EXTENSION);
	$imageData = file_get_contents($imagePath);
	// $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
	$base64 = base64_encode($imageData);

//	echo " ".$base64;

	$object = [];
		$object["result"] = "success";
		$object["requestID"] = "123";
		$object["data"] = [
			"cameraID" => $cameraID,
			"modified" => "...",
			"base64" => $base64,
		];
	$jsonObject = json_encode($object);


header('Content-Type: application/json; charset=utf-8');
//echo json_encode($data);
	echo "".$jsonObject;

	// $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);

/*
{
	"result":"success", // string: success | failure
	"requestID":"...", // user-defined or generated nonce
	"data": {
		"cameraID": "..." // camera ID
		"modified": "..." // TIMESTAMP ?
		"base64": "..." // base64 encoded binary image data
	}
}
*/


}else{
	//echo "<br/>unknown";
	$newURL = "./images/test.jpg";
	// 
	header('Location: '.$newURL);
	// http_redirect($url);
}




?>
