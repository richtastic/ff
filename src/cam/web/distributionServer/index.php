<?php

include "../../../php/fw/files.php";

error_log("ENTER index.php");
// tail -f /var/log/apache2/error_log

// error_log


// error_log("Error message\n", 3, "/var/log/apache2/error_log");
// error_log("Error message\n", 3, "/Users/richard.zirbes/Desktop/php.log");



/*
- REQUESTS:
	- path: /camera/<ID>/image
		
	- path: /camera/<ID>/upload
		- data:
			- cameraID ?
			- base64: base64 binary value for data




// big base64 strings:
https://www.php.net/manual/en/function.base64-decode.php



*/


/*

header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Cache-Control: no-cache");
header("Pragma: no-cache");

*/

header("Access-Control-Allow-Origin: *");




// camera public cdn / distribution service


$path = "";
if(isset($_GET["path"])){
	$path = $_GET["path"];
}else if(isset($_POST["path"])){
	$path = $_POST["path"];
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

function returnFailureToClient($reason){
	if(!isset($reason)){
		$reason = "";
	}

	$object = [
		"result" => "failure",
		"reason" => $reason,
		"requestID" => "123",
	];
	$jsonObject = json_encode($object);

	// $jsonObject = '{"bl":"eh"}';
	header('Content-Type: application/json; charset=utf-8');
	echo "".$jsonObject;
	http_response_code(200);
	exit();
}



// returnFailureToClient("NEVER START");
// return;




function sanitizeDataString($string){
	$string = str_replace("/","",$string);
	return $string;
}


function isBinaryImageJPG($binary){
	return false; // ?
}
function isBinaryImagePNG($binary){
	echo "not work with binary string";
	echo "gettype: ".gettype($binary)."\n";
	echo "strlen: ".strlen($binary)."\n";
	// if(sizeof($binary)<4){
	// echo "binary: ".$binary;
	if(strlen($binary)<4){
	// if(length($binary)<4){
		return false;
	}
	echo "0: ".$binary[0]."\n";
	echo "1: ".$binary[1]."\n";
	echo "2: ".$binary[2]."\n";
	echo "3: ".$binary[3]."\n";
	echo ($binary[0]=="?")."\n";
	echo (strcmp($binary[0],"?")==0)."\n";
	echo "...\n";
	if(strcmp($binary[0],"?")==0 && strcmp($binary[1],"P")==0 && strcmp($binary[2],"N")==0 && strcmp($binary[3],"G")==0){
		echo "is png";
		return true;
	}
	return false;
}


if( count($pathList)>0 && $pathList[0]=="camera" ){

	error_log("start request at camera: ".$path);
//	echo "<br/>camera path";
	$cameraID = $pathList[1];
	$cameraID = sanitizeDataString($cameraID);
//	echo "<br/>camera ID: ".$cameraID;
	$cameraOperation = $pathList[2];
//	echo "<br/>camera OP: ".$cameraOperation;


	// /camera/<ID>/image
	// /camera/<ID>/upload/image


	if($cameraOperation=="image"){ // get image
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
		// echo "".$jsonObject;
	}else if($cameraOperation=="upload"){ // upload image
// returnFailureToClient("before ... A");
// return;
		$data = null;
		if(isset($_POST["data"])){
			$data = $_POST["data"];
			// echo $data;
		}else if(isset($_GET["data"])){
			$data = $_GET["data"];
		}
		if($data!=null){
			// echo"got data\n";
			// echo $data;

			// convert to json:
			$object = json_decode($data, true);

			$payloadBase64Key = "base64";

			if( !isset($object[$payloadBase64Key]) ){
				returnFailureToClient("image upload with no base64 data");
				return;
			}
// returnFailureToClient("before ... X");
// return;
			$base64ImageData = $object[$payloadBase64Key];
			// echo"base64ImageData: \n".$base64ImageData;
			$binaryImageData = base64_decode($base64ImageData);

			// echo "binaryImageData[2]: ".$binaryImageData[2];


			// $isPNG = isBinaryImagePNG($binaryImageData);
			// echo"\nisPNG: ".$isPNG."\n";

			$baseFilesystemLocation = "filesystem/";
			$imageExtension = "jpg";
			$imageName = "image.".$imageExtension;
			$parentDirectory = $baseFilesystemLocation."cameras/".$cameraID;

			// echo " parentDirectory: ".$parentDirectory."\n";
			// createDirectoryAtLocation($parentDirectory, true);

			// this path needs to be constant
			$imageFilePath = $parentDirectory."/".$imageName; // TODO: IMAGE TYPE ? jpg / png / ... ?

			// echo " imageFilePath: ".$imageFilePath."\n";

			$ifp = fopen($imageFilePath, "wb");
			$result = fwrite($ifp, $binaryImageData);
			fclose($ifp);

		    // how to tell if success ?
			// echo"\n result: ".$result."\n";


//$result = 0;

			if($result>0){ // todo: get length of result matching length of string
				
				$object = [
					"result" => "success",
					"requestID" => "123",
					"data" => [
						"cameraID" => $cameraID,
						"modified" => "...",
						// "base64" => $base64,
					]
				];
				$jsonObject = json_encode($object);
				header('Content-Type: application/json; charset=utf-8');
				echo "".$jsonObject;
				
				// returnFailureToClient("success ... ");
				return;
			}else{
				returnFailureToClient("could not write data to path: ".$imageFilePath);
				return;
			}

		}else{
			returnFailureToClient("image upload with no data");
			return;
		}
		/*
		$object = [
			"result" => "success",
			"requestID" => "123",
			"data" => [
				"cameraID" => $cameraID,
				"modified" => "...",
				// "base64" => $base64,
			]
		];
		header('Content-Type: application/json; charset=utf-8');
		echo "".$jsonObject;
		*/

	}else{
		returnFailureToClient("unknown operation");
	}

	/*
openssl base64 -in <infile> -out <outfile>
	*/

	// $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
/*


192.168.1.69


curl http://192.168.1.69:80/?path=&data=


{
	"camera":"0",
	"data":"iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAMAAAD3JJ6EAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAh1BMVEUAAAAcHNQnJ8MeHssVFb0UhhQtjC04tTgzM8YmJqIxMaUfH9Q4mjgueC4nlCdHu0dAQNpLS7VGMpyfMWeaOSQxVBYbdhsZjxlaWvKnHy6UMjKYQ0OkSzEcjByzMzOHGxmQLiu5OjqsUiuTMxu2Xjy7URuzsz+Pjy+MjCqiojmVlRmRkRj///8z/xahAAAALHRSTlMABXmJBAFhR3by71Zh5uQhQPHxxMvg7TU80enkyjGR7vK5OOn1PgbAyA8AADUqQYUAAAABYktHRCy63XGrAAAAB3RJTUUH4AQXEQMUzs02PQAAAEZJREFUCNdjYGBkYmZhZWNnAAIOTi5uHl4+fiBTQFBIWERUTBwkLCEpJS0jywAGcvIKihAWg5KyiiqUqaauoQllMmhpg0gAlGADs5tyhogAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMDQtMjNUMTc6MDM6MzktMDc6MDBHxukhAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE2LTA0LTIzVDE3OjAzOjIwLTA3OjAwb6kU0AAAAABJRU5ErkJggg==",
}


localhost/web/ff/cam/web/distributionServer/index.php?path=%2Fcamera%2F0%2Fimage
http://localhost/web/ff/cam/web/distributionServer/index.php?path=%2Fcamera%2F0%2Fimage

curl http://192.168.1.69/web/ff/cam/web/distributionServer/index.php?path=%2Fcamera%2F0%2Fimage&path=%2Fcamera%2F1%2Fupload&payload=%7B%22camera%22%3A%220%22%2C%22data%22%3A%22iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAMAAAD3JJ6EAAAABGdBTUEAALGPC%2FxhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAh1BMVEUAAAAcHNQnJ8MeHssVFb0UhhQtjC04tTgzM8YmJqIxMaUfH9Q4mjgueC4nlCdHu0dAQNpLS7VGMpyfMWeaOSQxVBYbdhsZjxlaWvKnHy6UMjKYQ0OkSzEcjByzMzOHGxmQLiu5OjqsUiuTMxu2Xjy7URuzsz%2BPjy%2BMjCqiojmVlRmRkRj%2F%2F%2F8z%2FxahAAAALHRSTlMABXmJBAFhR3by71Zh5uQhQPHxxMvg7TU80enkyjGR7vK5OOn1PgbAyA8AADUqQYUAAAABYktHRCy63XGrAAAAB3RJTUUH4AQXEQMUzs02PQAAAEZJREFUCNdjYGBkYmZhZWNnAAIOTi5uHl4%2BfiBTQFBIWERUTBwkLCEpJS0jywAGcvIKihAWg5KyiiqUqaauoQllMmhpg0gAlGADs5tyhogAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMDQtMjNUMTc6MDM6MzktMDc6MDBHxukhAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE2LTA0LTIzVDE3OjAzOjIwLTA3OjAwb6kU0AAAAABJRU5ErkJggg%3D%3D%22%7D

iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAMAAAD3JJ6EAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAh1BMVEUAAAAcHNQnJ8MeHssVFb0UhhQtjC04tTgzM8YmJqIxMaUfH9Q4mjgueC4nlCdHu0dAQNpLS7VGMpyfMWeaOSQxVBYbdhsZjxlaWvKnHy6UMjKYQ0OkSzEcjByzMzOHGxmQLiu5OjqsUiuTMxu2Xjy7URuzsz+Pjy+MjCqiojmVlRmRkRj///8z/xahAAAALHRSTlMABXmJBAFhR3by71Zh5uQhQPHxxMvg7TU80enkyjGR7vK5OOn1PgbAyA8AADUqQYUAAAABYktHRCy63XGrAAAAB3RJTUUH4AQXEQMUzs02PQAAAEZJREFUCNdjYGBkYmZhZWNnAAIOTi5uHl4+fiBTQFBIWERUTBwkLCEpJS0jywAGcvIKihAWg5KyiiqUqaauoQllMmhpg0gAlGADs5tyhogAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMDQtMjNUMTc6MDM6MzktMDc6MDBHxukhAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE2LTA0LTIzVDE3OjAzOjIwLTA3OjAwb6kU0AAAAABJRU5ErkJggg==




# upload camera image data:
curl "http://192.168.0.140/web/ff/cam/web/distributionServer/index.php?path=%2Fcamera%2F1%2Fupload&data=%7B%22camera%22%3A%220%22%2C%22base64%22%3A%22iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAMAAAD3JJ6EAAAABGdBTUEAALGPC%2FxhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAh1BMVEUAAAAcHNQnJ8MeHssVFb0UhhQtjC04tTgzM8YmJqIxMaUfH9Q4mjgueC4nlCdHu0dAQNpLS7VGMpyfMWeaOSQxVBYbdhsZjxlaWvKnHy6UMjKYQ0OkSzEcjByzMzOHGxmQLiu5OjqsUiuTMxu2Xjy7URuzsz%2BPjy%2BMjCqiojmVlRmRkRj%2F%2F%2F8z%2FxahAAAALHRSTlMABXmJBAFhR3by71Zh5uQhQPHxxMvg7TU80enkyjGR7vK5OOn1PgbAyA8AADUqQYUAAAABYktHRCy63XGrAAAAB3RJTUUH4AQXEQMUzs02PQAAAEZJREFUCNdjYGBkYmZhZWNnAAIOTi5uHl4%2BfiBTQFBIWERUTBwkLCEpJS0jywAGcvIKihAWg5KyiiqUqaauoQllMmhpg0gAlGADs5tyhogAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMDQtMjNUMTc6MDM6MzktMDc6MDBHxukhAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE2LTA0LTIzVDE3OjAzOjIwLTA3OjAwb6kU0AAAAABJRU5ErkJggg%3D%3D%22%7D"


curl -X POST "http://192.168.0.140/web/ff/cam/web/distributionServer/index.php?path=%2Fcamera%2F1%2Fupload&data=%7B%22camera%22%3A%220%22%2C%22base64%22%3A%22iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAMAAAD3JJ6EAAAABGdBTUEAALGPC%2FxhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAh1BMVEUAAAAcHNQnJ8MeHssVFb0UhhQtjC04tTgzM8YmJqIxMaUfH9Q4mjgueC4nlCdHu0dAQNpLS7VGMpyfMWeaOSQxVBYbdhsZjxlaWvKnHy6UMjKYQ0OkSzEcjByzMzOHGxmQLiu5OjqsUiuTMxu2Xjy7URuzsz%2BPjy%2BMjCqiojmVlRmRkRj%2F%2F%2F8z%2FxahAAAALHRSTlMABXmJBAFhR3by71Zh5uQhQPHxxMvg7TU80enkyjGR7vK5OOn1PgbAyA8AADUqQYUAAAABYktHRCy63XGrAAAAB3RJTUUH4AQXEQMUzs02PQAAAEZJREFUCNdjYGBkYmZhZWNnAAIOTi5uHl4%2BfiBTQFBIWERUTBwkLCEpJS0jywAGcvIKihAWg5KyiiqUqaauoQllMmhpg0gAlGADs5tyhogAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMDQtMjNUMTc6MDM6MzktMDc6MDBHxukhAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE2LTA0LTIzVDE3OjAzOjIwLTA3OjAwb6kU0AAAAABJRU5ErkJggg%3D%3D%22%7D"































curl "http://192.168.1.69/web/ff/cam/web/distributionServer/index.php?path=%2Fcamera%2F1%2Fupload




*/

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
