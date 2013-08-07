<?php
// functions.php



function includeHeader($title='Title'){
	echo '
<html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<head>
	<title>'.$title.'</title>
	<link rel="stylesheet" type="text/css" href="./volunteer.css">
	<script type="text/javascript" src="./classes/json3.min.js"></script>
	<script type="text/javascript" src="./classes/Code.js"></script>
	<script type="text/javascript" src="./classes/Ajax.js"></script>
	<script type="text/javascript" src="./Volunteer.js"></script>
	<script>
	handlePageLoadedFunction = function(e){
		var vol = new Volunteer();
	}
	</script>
</head>
<body onload="handlePageLoadedFunction();">
	';
}
function includeBody(){
	echo '
	<div>
		<div id="login">
			<input type="text" name="login_username" />
			<input type="password" name="login_password" />
			<input type="submit" name="login_submit" value="Log In" />
		</div>
		<div id="logout">
			<input type="submit" name="logout_submit" value="Log Out" />
		</div>
		<div id="content">
			<div id="section_calendar"></div>
			<div id="section_profile"></div>
			<div id="section_crud_user"></div>
			<div id="section_crud_shift"></div>
			<div id="section_crud_"></div>
			<div id="section_"></div>
			<div id=""></div>
		</div>
	</div>
	';
}
function includeFooter(){
	echo '
</body>
</html>
	';
}

function randomSessionID(){
	return randomHex(64);
}

function randomHex($val=8){
	$str = "";
	for($i=0;$i<$val;++$i){
		$str = $str.strtoupper(base_convert(rand(0,15), 10, 16));
	}
	return $str;
}

function timeValuesFromString($str){ // hour : minute : second . millisecond
	if(strlen($str)<13){
		return null;
	}
	$arr = array();
	array_push($arr, intval(substr($str,0,2)) );
	array_push($arr, intval(substr($str,3,2)) );
	array_push($arr, intval(substr($str,6,2)) );
	array_push($arr, intval(substr($str,9,4)) );
	return $arr;
}

function computeDatePermutations($begin,$end,$code){
	echo $begin." -> ".$end." | ".$code."\n";
	$i=0; $j=0; $index=0; $dow=0; $beginDate=""; $endDate="";
	//$beginDate = dateFromString($begin);
	//echo "a--------".$beginDate."----";
	//
	//$beginDate = date($begin);
	//seconds
	$beginDate = strtotime($begin);
	$endDate = strtotime($end);
	//
	$tempList = explode(",",$code);
	$daysList = array();
	for($i=0;$i<7;++$i){
		array_push($daysList, "");
	}
	$len = count($tempList);
	$len2 = count($daysList);
	for($i=0;$i<$len;++$i){
		$dow = substr($tempList[$i],0,1);
		if($dow=="M"){
			$index = 0;
		}else if($dow=="T"){
			$index = 1;
		}else if($dow=="W"){
			$index = 2;
		}else if($dow=="R"){
			$index = 3;
		}else if($dow=="F"){
			$index = 4;
		}else if($dow=="S"){
			$index = 5;
		}else if($dow=="U"){
			$index = 6;
		}else{
			$index = -1;
		}
		if($index>=0 && $index<$len2 ){
			$daysList[$index] = substr($tempList[$i],2, strlen($tempList[$i]) );
		}
	}
	// ...
	$len = count($daysList);
	for($i=0;$i<$len;++$i){
		$daysList[$i] = explode("&",$daysList[$i]);
		$len2 = count($daysList[$i]);
		if( $len2>0 && $daysList[$i][0]!=null && $daysList[$i][0]!="" ){
			for($j=0;$j<$len2;++$j){
				echo "::::::".$daysList[$i][$j]."\n";
				$daysList[$i][$j] = explode("-",$daysList[$i][$j]);
				$daysList[$i][$j][0] = timeValuesFromString( $daysList[$i][$j][0] );
				$daysList[$i][$j][1] = timeValuesFromString( $daysList[$i][$j][1] );
				echo $daysList[$i][$j][0][0]." ".$daysList[$i][$j][0][1]." ".$daysList[$i][$j][0][2]." ".$daysList[$i][$j][0][3]." \n";
			}
		}
	}
	//
	// $date = new Date();
	// $time=null; $temp=null; $start=null; $stop=null;
	// $beginTime = $beginDate.getTime();
	// $endTime = $endDate.getTime();
	// $date = new Date( $beginDate.getTime() );
	// $date = new Date( $date.getFullYear(), $date.getMonth(), $date.getDate() );
	// $time = $date.getTime();
	// ...
	$arr = array("hia there");
	return $arr;
}


/*
this.computePermutations = function(begin,end,code){

		var date = new Date();
		var time, temp, start, stop;
		var beginTime = beginDate.getTime();
		var endTime = endDate.getTime();
		date = new Date( beginDate.getTime() );
		date = new Date( date.getFullYear(), date.getMonth(), date.getDate() );
		time = date.getTime();
		//console.log("START --------------");
		while(time<=endTime){// for each day
			//console.log( date );
			dow = date.getDay();
			if(dow==1){ // monday
				index = 0;
			}else if(dow==2){
				index = 1;
			}else if(dow==3){
				index = 2;
			}else if(dow==4){
				index = 3;
			}else if(dow==5){
				index = 4;
			}else if(dow==6){
				index = 5;
			}else if(dow==0){ // sunday
				index = 6;
			}
			if( daysList[index].length > 0 && daysList[index][0]!=null && daysList[index][0]!="" ){
				for(i=0;i<daysList[index].length;++i){ // start/stop list
						j = 0;
						start = new Date( date.getFullYear(), date.getMonth(), date.getDate(),
							daysList[index][i][j][0], daysList[index][i][j][1], daysList[index][i][j][2], daysList[index][i][j][3] );
						j = 1;
						stop = new Date( date.getFullYear(), date.getMonth(), date.getDate(),
							daysList[index][i][j][0], daysList[index][i][j][1], daysList[index][i][j][2], daysList[index][i][j][3] );
						//console.log( start +" - "+ stop );
				}
			}
			date = new Date( date.getTime() + 24*60*60*1000 );
			date = new Date( date.getFullYear(), date.getMonth(), date.getDate() );
			time = date.getTime();
		}
		//console.log("DONE ===============");

	}
	this.timeValuesFromString = function(str){
		if(str.length<13){
			return null;
		}
		var arr = new Array();
		arr.push( parseInt(str.substr(0,2)) );
		arr.push( parseInt(str.substr(3,2)) );
		arr.push( parseInt(str.substr(6,2)) );
		arr.push( parseInt(str.substr(9,4)) );
		return arr;
	}
	this.dateFromString = function(str){
		if(str.length<11){
			return null;
		}
		var arr, yyyy=0, mm=0, dd=0, hh=0, nn=0, ss=0, nnnn=0;
		yyyy = parseInt(str.substr(0,4));
		mm = parseInt(str.substr(5,2)) - 1;
		dd = parseInt(str.substr(8,2));
		if(str.length>=24){
			arr = self.timeValuesFromString(str.substr(11,str.length));
			hh = arr[0];
			nn = arr[1];
			ss = arr[2];
			nnnn = arr[3];
		}
		var date = new Date(yyyy, mm, dd, hh, nn, ss, nnnn);
		date.setUTC
		return date;
	}
*/


function doSomething($val='default'){
	echo "doSomething ".$val;
}

?>