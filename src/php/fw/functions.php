<?php
// functions.php

function require_once_directory($directory){
	error_log("require_once_directory: '".$directory."'");
	$phpEnding = ".php";
	$phpEndingStringLength = strlen($phpEnding);
	error_log("YEP: '".$directory."'");
	if($directory){

		$directoryExists = file_exists($directory);
		error_log("directoryExists: '".$directoryExists."'");
		if($directoryExists){
			$fileList = scandir($directory);
			foreach($fileList as $fileKey => $fileValue){
				error_log($fileKey." = ".$fileValue);
				$fileName = $fileValue;
				$fileStringLength = strlen($fileName);
				if( $fileStringLength > $phpEndingStringLength && substr($fileName, $fileStringLength-$phpEndingStringLength, $phpEndingStringLength) == $phpEnding ) {
					$fileName = $directory."/".$fileName.""; // need full file path
					error_log("require: '".$fileName."'");
					$exists = file_exists($fileName);
					error_log("exists: ".$exists);
					require_once $fileName;
				}
			}
		}
	}
	error_log("OUT...");
}

function giauToSQLSearchString($value){
	$value = preg_replace('/%/', '\\%', $value);
	$value = preg_replace('/ /', '%', $value);
	return $value;
}

function padLeft($input, $padding, $count){
	$string = "".$input; // force string
	if( strlen($string)>$count ){
		$string = substr($string, 0, $count);
	}
	return str_pad($string, $count, $padding,STR_PAD_LEFT);
}
function padRight($input, $padding, $count){
	$string = "".$input; // force string
	if( strlen($string)>$count ){
		$string = substr($string, 0, $count);
	}
	return str_pad($string, $count, $padding,STR_PAD_RIGHT);
}
function getDateNow(){
	return dateFromString( date("Y-m-d H:i:s.0000") ); // milliseconds = v in php7 0-999
}
function getDateYear($time){
	return date("Y",$time);
}
function getDateMonth($time){
	return date("m",$time);
}
function getDateDay($time){
	return date("d",$time);
}
function getDateHour($time){
	return date("H",$time);
}
function getDateMinute($time){
	return date("i",$time);
}
function getDateSecond($time){
	return date("s",$time);
}
function getDateMilliecond($time){
	return date("s",$time);
}
function mergeObjects(&$objectA, &$objectB, $recursive){
	if(!$objectA){
		$objectA = [];
	}
	if(!$objectB){
		$objectB = [];
	}
	if($recursive){
		return array_merge_recursive($objectA, $objectB);
	}else{
		return array_merge($objectA, $objectB);
	}
}
		
function reverseObjectMap($obj){
	if(!$obj){
		return [];
	}
	$reverse = [];
	$keys = array_keys($obj);
	$i;
	$len = count($keys);
	for($i=0; $i<$len; ++$i){
		$key = $keys[$i];
		$val = $obj[$key];
		if($key && $val){
			$reverse[$val] = $key;
			//unset($arr);
		}
	}
	return $reverse;
}
function objectToString($obj=null, $tab=" "){
	$str = "";
	if($obj==null){
		$str = "(null)";
	}else{
		// is_object
		if(!is_array($obj)){
			if(is_string($obj)){
				$str = "\"".$obj."\"";
			}else{
				$str = "".$obj;
			}
		}else{
			$str = $str."[\n";
			$keys = array_keys($obj);
			$i;
			$len = count($keys);
			for($i=0; $i<$len; ++$i){
				$key = $keys[$i];
				$val = $obj[$key];
				$str = $str."".$tab."".$key." => ".objectToString($val, $tab."    ")."\n";
			}
			$str = $str.$tab."]";
		}
	}
	return $str;
}

function getKeys($obj){
	return array_keys($obj);
}

function commaSeparatedArray($array){
	return implode(",",$array);
}

function colorHTMLFromColorString($color){
	$color = preg_replace('/^(0x|#)/', '', $color);
	$color = strtoupper($color);
	$len = strlen($color);
	if($len==3){ // 0xRGB
		$r = substr($color,0,1);
		$g = substr($color,1,1);
		$b = substr($color,2,1);
		return "#".$r.$r.$g.$g.$b.$b;
	}else if($len==4){ // 0xARGB
		$a = substr($color,0,1);
		$r = substr($color,1,1);
		$g = substr($color,2,1);
		$b = substr($color,3,1);
		$a = $a.$a;
		$r = $r.$r;
		$g = $g.$g;
		$b = $b.$b;
		$a = intval($a,16);
		$f = intval($r,16);
		$g = intval($g,16);
		$b = intval($b,16);
		$a = $a/255.0;
		return "rgba(".$r.",".$g.",".$b.",".$a.")";
	}else if($len==6){ // 0xRRGGBB
		$r = substr($color,0,2);
		$g = substr($color,2,2);
		$b = substr($color,4,2);
		return "#".$r.$g.$b;
	}else if($len==8){ // 0xAARRGGBB
		$a = substr($color,0,2);
		$r = substr($color,2,2);
		$g = substr($color,4,2);
		$b = substr($color,6,2);
		$a = intval($a,16);
		$f = intval($r,16);
		$g = intval($g,16);
		$b = intval($b,16);
		$a = $a/255.0;
		return "rgba(".$r.",".$g.",".$b.",".$a.")";
	}
	return "#000000";
}

function stringWithMatxLength($original, $maxLength, $fromRight = false){
	if(!$original){
		return "";
	}
	$len = strlen($original);
	if($len > $maxLength){
		return substr($original, 0, $maxLength);
	}
	return $original;
}

function substituteLiteralNewlinesToHTMLBreaks($editorString){
	if($editorString){
		$htmlString = preg_replace('/\\n/', '<br/>', $editorString);
		return $htmlString;
	}
	return null;
}

function substituteHTMLBreaksToLiteralNewlines($htmlString){
	$editorString = preg_replace('/<( )*br( )*(/)*( )*>/', '\\n', $htmlString);
	return $editorString;
}

function addTimeToSeconds($seconds,$yea,$mon,$day,$hou,$min,$sec,$nano){
	$oH = intval(date("H",$seconds));
	$oN = intval(date("i",$seconds));
	$oS = intval(date("s",$seconds));
	$oM = intval(date("m",$seconds));
	$oD = intval(date("d",$seconds));
	$oY = intval(date("y",$seconds));
	return mktime($oH+$hou,$oN+$min,$oS+$sec, $oM+$mon,$oD+$day,$oY+$yea);
}
function stringFromHumanTime($year, $month, $day, $hour, $minute, $second, $millisecond){// 0-9999, 1-12, 1-31, 0-23, 0-59, 0-59, 0-9999
	$year = intval($year); $year = min(max($year,0),9999);
	$month = intval($month); $month = min(max($month,1),12);
	$day = intval($day); $day = min(max($day,1),31);
	$hour = intval($hour); $hour = min(max($hour,0),23);
	$minute = intval($minute); $minute = min(max($minute,0),59);
	$second = intval($second); $second = min(max($second,0),59);
	$millisecond = intval($millisecond); $millisecond = min(max($millisecond,0),9999);
	//
	$year = padLeft($year,"0",4);
	$month = padLeft($month,"0",2);
	$day = padLeft($day,"0",2);
	$hour = padLeft($hour,"0",2);
	$minute = padLeft($minute,"0",2);
	$second = padLeft($second,"0",2);
	$millisecond = padLeft($millisecond,"0",4);
	return $year."-".$month."-".$day." ".$hour.":".$minute.":".$second.".".$millisecond;
}
function stringFromDate($dat){
	return date("Y-m-d H:i:s.0000",$dat); // YYYY-MM-DD HH:MM:SS.NNNN
}
function timeValuesFromString($str){ // hour : minute : second . millisecond
	if(strlen($str)<8){
		return null;
	}
	$arr = array();
	array_push($arr, intval(substr($str,0,2),10) );
	array_push($arr, intval(substr($str,3,2),10) );
	array_push($arr, intval(substr($str,6,2),10) );
	if(strlen($str)>=13){
		array_push($arr, intval(substr($str,9,4),10) );
	}else{
		array_push($arr, 0 );
	}
	return $arr;
}
function dateFromString($str){ // seconds from Unix Epoc
	if( strlen($str)<10 ){
		return null;
	}
	$arr=null; $yyyy=0; $mm=0; $dd=0; $hh=0; $nn=0; $ss=0; $nnnn=0;
	$yyyy = intval(substr($str,0,4));
	$mm = intval(substr($str,5,2)); // +1
	$dd = intval(substr($str,8,2));
	if( strlen($str)>=19 ){
		$arr = timeValuesFromString(substr($str,11,strlen($str)));
		$hh = $arr[0];
		$nn = $arr[1];
		$ss = $arr[2];
		if(count($arr)==4){
			$nnnn = $arr[3];
		}
	}
	$date = mktime($hh,$nn,$ss,$mm,$dd,$yyyy);
	// gmmktime
	return $date;
}
// function getTimestampMilliseconds($){ // 2015-06-28T12:34:56.0000Z
// 	return ;
// }
// function getTimestampISO8601FromMilliseconds($timestamp){
// 	$seconds = round($timestamp/1000);
// 	$milliseconds = ($seconds*1000) - $timestamp;
// 	timestamp = $seconds; 
// 	$date = getdate($timestamp);
// 	$seconds = $date["seconds"];
// 	$minutes = $date["minutes"];
// 	$hours = $date["hours"];
// 	$day = $date["mday"];
// 	$month = $date["mon"];
// 	$year = $date["year"];
// 	$timestamp = $year."-".$month."-".$day."T".$hour.":".$minutes.":".$seconds.".".$milliseconds;
// 	return $timestamp;
// }

/*

function dateFromString($str){
	if( strlen($str)<10 ){
		return null;
	}
	$arr=null; $yyyy=0; $mm=0; $dd=0; $hh=0; $nn=0; $ss=0; $nnnn=0;
	$yyyy = intval(substr($str,0,4));
	$mm = intval(substr($str,5,2)); // +1
	$dd = intval(substr($str,8,2));
	if( strlen($str)>=19 ){
		$arr = timeValuesFromString(substr($str,11,strlen($str)));
		$hh = $arr[0];
		$nn = $arr[1];
		$ss = $arr[2];
		if(count($arr)==4){
			$nnnn = $arr[3];
		}
	}
	$date = mktime($hh,$nn,$ss,$mm,$dd,$yyyy,-1);
	// date.setUTC
	return $date;
}

function timeValuesFromString($str){ // hour : minute : second . millisecond
	if(strlen($str)<8){
		return null;
	}
	$arr = array();
	array_push($arr, intval(substr($str,0,2),10) );
	array_push($arr, intval(substr($str,3,2),10) );
	array_push($arr, intval(substr($str,6,2),10) );
	if(strlen($str)>=13){
		array_push($arr, intval(substr($str,9,4),10) );
	}else{
		array_push($arr, 0 );
	}
	return $arr;
}


*/

?>
