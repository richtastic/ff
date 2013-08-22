<?php
// functions.php

// iOS icons
// <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png">
// <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png">
// <link rel="apple-touch-icon" href="/apple-touch-icon-57x57.png">
// <link rel="apple-touch-startup-image" href="/splash-startup.png"> exactly 320x460
// IE+
// <meta http-equiv="X-UA-Compatible" content="IE=edge">
// Palm+BlackBerry
// <meta name="HandheldFriendly" content="true">
// WindowsMobilePhone
// <meta name="MobileOptimized" content="width">



function includeHeader($title='Title'){
	echo '
<html>
<head>
	<title>'.$title.'</title>
	<!-- SEO -->
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta property="og:type" content="website" />
	<meta name="description" content="Scheduling Interface BSFTH." />
	<meta property="og:description" content="Scheduling Interface BSFTH." />
	<meta name="keywords" content="boulder, shelter, homeless" />
	<meta property="og:url" content="http://www.whatevs.com/" />
	<link rel="canonical" href="http://www.whatevs.com/" />
	<!-- mobile -->
	<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
	<!-- safari -->
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
	<!-- externals -->
	<link rel="stylesheet" type="text/css" href="./volunteer.css">
	<script type="text/javascript" src="./classes/json3.min.js"></script>
	<script type="text/javascript" src="./classes/sha512.js"></script>
	<script type="text/javascript" src="./classes/Code.js"></script>
	<script type="text/javascript" src="./classes/Dispatch.js"></script>
	<script type="text/javascript" src="./classes/Dispatchable.js"></script>
	<script type="text/javascript" src="./classes/Ajax.js"></script>
	<script type="text/javascript" src="./classes/PageWeb.js"></script>
	<script type="text/javascript" src="./classes/NavWeb.js"></script>
	<script type="text/javascript" src="./classes/Navigation.js"></script>
	<script type="text/javascript" src="./ServerVolunteerInterface.js"></script>
	<script type="text/javascript" src="./PageLogin.js"></script>
	<script type="text/javascript" src="./PageCalendarDay.js"></script>
	<script type="text/javascript" src="./PageCalendarWeek.js"></script>
	<script type="text/javascript" src="./PageCalendarMonth.js"></script>
	<script type="text/javascript" src="./PageRequest.js"></script>
	<script type="text/javascript" src="./PageRequestList.js"></script>
	<script type="text/javascript" src="./PageShifts.js"></script>
	<script type="text/javascript" src="./PageShiftsList.js"></script>
	<script type="text/javascript" src="./PageShiftSingle.js"></script>
	<script type="text/javascript" src="./PagePosition.js"></script>
	<script type="text/javascript" src="./PagePositionList.js"></script>
	<script type="text/javascript" src="./PageUser.js"></script>
	<script type="text/javascript" src="./PageUserList.js"></script>
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
	<div id="scheduler">
		<div id="scheduler_top"></div>
		<div id="scheduler_navigation"></div>
		<div id="scheduler_main"></div>
		<div id="scheduler_bottom"></div>
	</div>
	';
	// echo '
	// <div>
	// 	<div id="login">
	// 		<input type="text" name="login_username" />
	// 		<input type="password" name="login_password" />
	// 		<input type="submit" name="login_submit" value="Log In" />
	// 	</div>
	// 	<div id="logout">
	// 		<input type="submit" name="logout_submit" value="Log Out" />
	// 	</div>
	// 	<div id="content">
	// 		<div id="section_calendar">
	// 			<div id="calendar_week"></div>
	// 		</div>
	// 		<div id="section_profile"></div>
	// 		<div id="section_crud_user"></div>
	// 		<div id="section_crud_shift"></div>
	// 		<div id="section_crud_"></div>
	// 		<div id="section_"></div>
	// 		<div id=""></div>
	// 	</div>
	// </div>
	// ';
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

function stringFromDate($dat){
	return date("Y-m-d H:i:s.0000",$dat); // YYYY-MM-DD HH:NN:SS.NNNN
}
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
function getDayStartFromSeconds($seconds){
	return dateFromString( date("Y-m-d 00:00:00",$seconds) );
}
function getDayEndFromSeconds($seconds){
	return dateFromString( date("Y-m-d 23:59:59",$seconds) );
}
function standardSQLDateFromSeconds($seconds){
	return date("Y-m-d H:i:s",$seconds); //return "00-00-00 00:00:00";
}
function getFirstDayOfMonth($seconds){
	$dom = date("j",$seconds);
	while($dom!=1){
		$seconds = getPrevDay($seconds);
		$dom = date("j",$seconds);
	}
	return $seconds;
}
function getLastDayOfMonth($seconds){
	$max = date("t",$seconds);
	$dom = date("j",$seconds);
	while($dom!=$max){
		$seconds = getNextDay($seconds);
		$dom = date("j",$seconds);
	}
	return $seconds;
}
function getFirstMondayOfWeek($seconds){
	$dow = date("w",$seconds);
	while($dow!=1){
		$seconds = getPrevDay($seconds);
		$dow = date("w",$seconds);
	}
	return $seconds;
}
function getLastSundayOfWeek($seconds){
	$dow = date("w",$seconds);
	while($dow!=0){
		$seconds = getNextDay($seconds);
		$dow = date("w",$seconds);
	}
	return $seconds;
}
function getPrevDay($seconds){
	/*$next = $seconds;// - 24*60*60;
	$dat = mktime(0,0,0, intval(date("m",$next)),intval(date("d",$next))-1,intval(date("Y",$next)),-1);
	return $dat;*/
	$oH = intval(date("H",$seconds));
	$oN = intval(date("i",$seconds));
	$oS = intval(date("s",$seconds));
	$oM = intval(date("m",$seconds));
	$oD = intval(date("d",$seconds));
	$oY = intval(date("y",$seconds));
	return mktime($oH,$oN,$oS, $oM,intval($oD)-1,$oY,-1);
}
function getNextDay($seconds){
	$oH = intval(date("H",$seconds));
	$oN = intval(date("i",$seconds));
	$oS = intval(date("s",$seconds));
	$oM = intval(date("m",$seconds));
	$oD = intval(date("d",$seconds));
	$oY = intval(date("y",$seconds));
	return mktime($oH,$oN,$oS, $oM,intval($oD)+1,$oY,-1);
}
function addTimeToSeconds($seconds,$yea,$mon,$day,$hou,$min,$sec,$nano){
	$oH = intval(date("H",$seconds));
	$oN = intval(date("i",$seconds));
	$oS = intval(date("s",$seconds));
	$oM = intval(date("m",$seconds));
	$oD = intval(date("d",$seconds));
	$oY = intval(date("y",$seconds));
	return mktime($oH+$hou,$oN+$min,$oS+$sec, $oM+$mon,$oD+$day,$oY+$yea,-1);
}
function fullDateValid($date){
	$pattern = '/^[0-9][0-9][0-9][0-9]\-[0-9][0-9]\-[0-9][0-9] [0-9][0-9]:[0-9][0-9]:[0-9][0-9]\.[0-9][0-9][0-9][0-9]$/';
	if( !preg_match($pattern, $date, $matches) ){
		return false;
	}
	return $matches[0]==$date;
}
function fullDateAlgorithmValid($code){
	/*$pattern = '/M([0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]\.[0-9][0-9][0-9][0-9]\-[0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]\.[0-9][0-9][0-9][0-9][|]*)*\,
	T([0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]\.[0-9][0-9][0-9][0-9]\-[0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]\.[0-9][0-9][0-9][0-9][|]*)*\,
	W([0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]\.[0-9][0-9][0-9][0-9]\-[0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]\.[0-9][0-9][0-9][0-9][|]*)*\,
	R([0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]\.[0-9][0-9][0-9][0-9]\-[0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]\.[0-9][0-9][0-9][0-9][|]*)*\,
	F([0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]\.[0-9][0-9][0-9][0-9]\-[0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]\.[0-9][0-9][0-9][0-9][|]*)*\,
	S([0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]\.[0-9][0-9][0-9][0-9]\-[0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]\.[0-9][0-9][0-9][0-9][|]*)*\,
	U([0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]\.[0-9][0-9][0-9][0-9]\-[0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]\.[0-9][0-9][0-9][0-9][|]*)*';*/
	$pattern = '/([MTWRFSU]([0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]\.[0-9][0-9][0-9][0-9]\-[0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]\.[0-9][0-9][0-9][0-9][|]*)*,*)*/';
	if( !preg_match($pattern, $code, $matches) ){ // 3 matches
		return false;
	}
	return $matches[0]==$code;
}
function computeDatePermutations($begin,$end,$code){
	$MAX_NUM_DATES = 1000;
	if( !(fullDateValid($begin) && fullDateValid($end) && fullDateAlgorithmValid($code)) ){
		return null;
	}
	$i=0; $j=0; $index=0; $dow=0;
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
			$daysList[$index] = substr($tempList[$i],1, strlen($tempList[$i]) );
		}
	}
	$len = count($daysList);
	for($i=0;$i<$len;++$i){
		$daysList[$i] = explode("|",$daysList[$i]);
		$len2 = count($daysList[$i]);
		if( $len2>0 && $daysList[$i][0]!=null && $daysList[$i][0]!="" ){
			for($j=0;$j<$len2;++$j){
				$daysList[$i][$j] = explode("-",$daysList[$i][$j]);
				$daysList[$i][$j][0] = timeValuesFromString( $daysList[$i][$j][0] );
				$daysList[$i][$j][1] = timeValuesFromString( $daysList[$i][$j][1] );
//echo print_r($daysList[$i][$j][0])." & ".print_r($daysList[$i][$j][1])."\n";
			}
		}
	}
	$children = array();
	$beginDate = dateFromString($begin);
	$endDate = dateFromString($end);
	$time=null; $temp=null; $start=null; $stop=null;
	$beginTime = $beginDate;
	$endTime = $endDate;
	$time = $beginTime;
// DO A ROUGH CALCULATION TO DETERMINE HOW MANY WILL BE GENERATED - end-start years * weeks * M,T,W,R,F,S,U
//echo "START TIME: (".stringFromDate($time).")\n";
//echo "END   TIME: (".stringFromDate($endTime).")\n";
$count = 0;
	while($time<$endTime && $count<10000){ // for each day
		$dow = intval( date("w",$time) );
		if($dow==1){ // monday
			$index = 0;
		}else if($dow==2){
			$index = 1;
		}else if($dow==3){
			$index = 2;
		}else if($dow==4){
			$index = 3;
		}else if($dow==5){
			$index = 4;
		}else if($dow==6){
			$index = 5;
		}else if($dow==0){ // sunday
			$index = 6;
		}
		$len = count($daysList[$index]);
		if( $len>0 && $daysList[$index][0]!=null && $daysList[$index][0]!="" ){
			for($i=0;$i<$len;++$i){ // start/stop list
				$j = 0;
				// $seconds,$yea,$mon,$day,$hou,$min,$sec,$nano
				$start = addTimeToSeconds($time,0,0,0,
					intval($daysList[$index][$i][$j][0]),
					intval($daysList[$index][$i][$j][1]),
					intval($daysList[$index][$i][$j][2]),
					intval($daysList[$index][$i][$j][3]) );
				$j = 1;
				$stop = addTimeToSeconds($start,0,0,0,
					intval($daysList[$index][$i][$j][0]),
					intval($daysList[$index][$i][$j][1]),
					intval($daysList[$index][$i][$j][2]),
					intval($daysList[$index][$i][$j][3]) );
				array_push($children,array($start,$stop));
				if( count($children) >= $MAX_NUM_DATES ){
					return null;
				}
			}
		}
		$time = getNextDay($time);
		//echo "TIME: (".stringFromDate($time).")\n";
		++$count;
	}
	return $children;
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
							daysList[$index][$i][$j][0], daysList[$index][$i][$j][1], daysList[$index][$i][$j][2], daysList[$index][$i][$j][3] );
						j = 1;
						stop = new Date( date.getFullYear(), date.getMonth(), date.getDate(),
							daysList[$index][$i][$j][0], daysList[$index][$i][$j][1], daysList[$index][$i][$j][2], daysList[$index][$i][$j][3] );
						//console.log( start +" - "+ stop );
				}
			}
			date = new Date( date.getTime() + 24*60*60*1000 );
			date = new Date( date.getFullYear(), date.getMonth(), date.getDate() );
			time = date.getTime();
		}
		//console.log("DONE ===============");

	}
*/

/* SQL DB SPECIFIC: */
function doSomething($val='default'){
	echo "doSomething ".$val;
}

	// switch($dow){
	// 	case 0: // sunday
	// 	$dow = 6; break;
	// 	case 1: // monday
	// 	$dow = 0; break;
	// 	case 2: // tuesday
	// 	$dow = 1; break;
	// 	case 3: // wednesday
	// 	$dow = 2; break;
	// 	case 4: // thursday
	// 	$dow = 3; break;
	// 	case 5: // friday
	// 	$dow = 4; break;
	// 	case 6: // saturday
	// 	$dow = 5; break;
	// }

?>