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

$SUCCESS_STRING_VALUE="success";


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
	<script type="text/javascript" src="./classes/Code.js"></script>
	<script type="text/javascript" src="./classes/Dispatch.js"></script>
	<script type="text/javascript" src="./classes/Dispatchable.js"></script>
	<script type="text/javascript" src="./classes/Ajax.js"></script>
	<script type="text/javascript" src="./classes/json3.min.js"></script>
	<script type="text/javascript" src="./classes/sha512.js"></script>
	<script type="text/javascript" src="./classes/PageWeb.js"></script>
	<script type="text/javascript" src="./classes/NavWeb.js"></script>
	<script type="text/javascript" src="./classes/Navigation.js"></script>
	<script type="text/javascript" src="./ServerVolunteerInterface.js"></script>
	<script type="text/javascript" src="./PageMonthBlock.js"></script>
	<script type="text/javascript" src="./PageLogin.js"></script>
	<script type="text/javascript" src="./PageCalendarWeek.js"></script>
	<script type="text/javascript" src="./PageCalendarMonth.js"></script>
	<script type="text/javascript" src="./PageRequest.js"></script>
	<script type="text/javascript" src="./PageRequestList.js"></script>
	<script type="text/javascript" src="./PageShifts.js"></script>
	<script type="text/javascript" src="./PageShiftsList.js"></script>
	<script type="text/javascript" src="./PageShiftSingle.js"></script>
	<script type="text/javascript" src="./PagePositionList.js"></script>
	<script type="text/javascript" src="./PagePosition.js"></script>
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

function getDateNow(){
	return dateFromString( date("Y-m-d H:i:s.0000") );
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
function getHumanFullDateFromDate($seconds){
	return date("D j M Y, g:i A",$seconds); // Sat 11 Mar 2013, 11:25 PM
}
function getHumanDayFromDate($seconds){
	return date("D, M j, Y",$seconds); // Sat, Mar 12, 2013
}
function getHumanTimeOfDayFromDate($seconds){
	return date("g:i A",$seconds); // 11:26 PM
}

function encodeJSONString($str){
	//return json_encode($str);
	return str_replace('"','\"',$str);
}
function decodeString($str){
	//return urldecode($str);
	return rawurldecode($str."");
}

function decode_real_escape_string($str){
	return mysql_real_escape_string( decodeString($str) );
}

/* SQL DB SPECIFIC: */
function isValidPositionData($name,$info){
	$MAX_NAME_LENGTH = 32; $MAX_INFO_LENGTH = 1024;
	$nameLen = strlen($name);
	$infoLen = strlen($info);
	if( 0<$nameLen && $nameLen<=$MAX_NAME_LENGTH ){
		if( 0<$infoLen && $infoLen<=$MAX_INFO_LENGTH ){
			return true;
		}
	}
	return false;
}
// function userHasOverlappingShift($user_id,$shift_time_begin,$shift_time_end){
// 	return userHasOverlappingShift($user_id,$shift_time_begin,$shift_time_end, null);
// }
function userHasOverlappingShift($user_id,$shift_time_begin,$shift_time_end, $shift_id){
	$query = 'select id from shifts where parent_id!="0" and user_id="'.$user_id.'" and not ((time_begin<="'.$shift_time_begin.'" and time_end<="'.$shift_time_begin.'") or (time_begin>="'.$shift_time_end.'" and time_end>="'.$shift_time_end.'")) '
	.(($shift_id!=null)?(' and id!="'.$shift_id.'"'):(' ')).' limit 1;';
	$result = mysql_query($query);
	return !($result && mysql_num_rows($result)==0);
}
function setAllPendingRequestsFilledByUserBetweenTimeToOpen($user_id,$shift_time_begin,$shift_time_end){
	$query = 'update requests set fulfill_user_id="0", fulfill_date=NULL, status=0 where id in ('.
	' select request_id from '.
	' (select id as request_id,shift_id,request_user_id,fulfill_user_id,status as request_status from requests where fulfill_user_id="'.$user_id.'" and status=1) as A'. // answered,pending
	' inner join '.
	' (select id as the_shift_id,time_begin,time_end from shifts where parent_id!="0" and not ((time_begin<="'.$shift_time_begin.'" and time_end<="'.$shift_time_begin.'") or (time_begin>="'.$shift_time_end.'" and time_end>="'.$shift_time_end.'")) ) as B '.
	' on A.shift_id=B.the_shift_id '.
	' );';
	$result = mysql_query($query);
	mysql_free_result($result);
}
function closeAllPendingRequestsForShift($shift_id){
	$query = 'update requests set status="4" where status in ("0","1") and shift_id="'.$shift_id.'";';
	$result = mysql_query($query);
	mysql_free_result($result);
}
function autoSetRequestToEmptyOnTimePass($connection){
	$query = 'update requests set status="4" where id in (select id from (select requests.id as id, time_begin from requests left outer join shifts on requests.shift_id=shifts.id where requests.status<=1) as temp where time_begin<adddate(now(),interval 30 minute));';
	$result = mysql_query($query, $connection);
	mysql_free_result($result);
}
function logEventDB($connection,$time_offset_min,$ip_remote,$ip_forward, $uid,$type,$info){
	$time_now = ' adddate(now(),interval '. mysql_real_escape_string($time_offset_min).' minute) ';
	$ip_remote = mysql_real_escape_string($ip_remote);
	$ip_forward = mysql_real_escape_string($ip_forward);
	$uid = mysql_real_escape_string($uid);
	$type = substr( mysql_real_escape_string($type), 0, 32);
	$info = ($info!=null)?substr( mysql_real_escape_string($info), 0, 128):"";
	$query = 'insert into logs (created, ip_remote, ip_forward, user_id, type, info) values ('.$time_now.', "'.$ip_remote.'", "'.$ip_forward.'", "'.$uid.'", "'.$type.'", "'.$info.'");';
	$result = mysql_query($query, $connection);
	mysql_free_result($result);
}
function isValidUserData($username,$first_name,$last_name,$email,$phone,$address,$city,$state,$zip,$group_id,$user_pw,$new_pw,$confirm_pw, $isUpdate){
	if($isUpdate){
		// don't care about username
	}else{
		if( !($username!=null && strlen($username)>=3) ){
			return "username invalid";
		}
	}
	if( !($first_name!=null && strlen($first_name)>=2) ){
		return "first name invalid";
	}
	if( !($last_name!=null && strlen($last_name)>=2) ){
		return "last name invalid";
	}
	if( !(strlen($email)>=0) ){ // $email!=null && 
		return "email invalid";
	}
	if( !(strlen($phone)>=0) ){ // $phone!=null && 
		return "phone number invalid";
	}
	if( !(strlen($address)>=0) ){ // $address!=null && 
		return "address invalid:".$address;
	}
	if( !(strlen($city)>=0) ){ // $city!=null && 
		return "city invalid";
	}
	if( !(strlen($state)>=0) ){ // $state!=null && 
		return "state invalid";
	}
	if( !(strlen($zip)>=0) ){ // $zip!=null && 
		return "zip invalid";
	}
	if( !($group_id!=null && strlen($group_id)>=1 && intval($group_id)>0) ){
		return "group id invalid";
	}
	if( !($user_pw!=null && strlen($user_pw)>=1) ){
		return "password invalid";
	}
	if( !($new_pw!=null && strlen($new_pw)>=1) ){
		return "new password invalid";
	}
	if( !($confirm_pw!=null && strlen($confirm_pw)>=1) ){
		return "confirmed password invalid";
	}
	if( $new_pw!=$confirm_pw ){
		return "passwords unequal";
	}
	return "success";
}

function booleanStringTo01($str){
	if($str===true || $str=="true" || $str=="t"){
		return 1;
	}
	return 0;
}
function boolean01ToString($val){
	if($val!=null && ( intval($val)>0 || $val>0)){
		return "true";
	}
	return "false";
}


function getPhoneAsNumbers($phone){
	$i; $ch; $re; $result = ""; $len = strlen($phone);
	for($i=0;$i<$len;++$i){
		$ch = substr($phone,$i,1);
		$re = preg_replace('/[0-9]/',"",$ch);
		if($re==""){
			$result = $result."".$ch;
		}
	}
	return $result;
}

function sendEmail($toEmail, $fromEmail, $replyEmail, $subject, $body){
	if( $toEmail==null || count($toEmail)<1 ){
		return 0;
	}
	$headers = "From: ".$fromEmail."\r\nReply-To: ".$replyEmail."";
	//return mail($toEmail, $subject, $body, $headers);
	error_log('MAIL: '.$toEmail.' | '.$subject.' | '.$body);
}

function sendEmailBSFTH($toEmail, $subject,$body){ // qs500.pair.com
	$fromEmail = "noreply@bouldershelter.org";
	$replyEmail = "noreply@bouldershelter.org";
	return sendEmail($toEmail, $fromEmail, $replyEmail, $subject, $body);
}

function emailOnUserCreate($username, $email){
	$subject = 'BSFTH User Created';
	$body = 'You are receiving this because "'.$email.'" has been used to create an account on bouldershelter.org, '. 
		'under the username "'.$username.'" .';
	sendEmailBSFTH($email, $subject, $body);
}
function emailOnUserUpdate($username, $oldUsername, $email, $oldEmail, $password, $oldPassword){
	$isNewUsername = $username!=$oldUsername;
	$isNewEmail = $email!=$oldEmail;
	$isNewPassword = $password!=$oldPassword;
	if($isNewUsername || $isNewEmail || $isNewPassword){
		$subject = 'BSFTH User Updated';
		$body = 'You are receiving this because: ';
		if($isNewUsername){
			$body = $body.'*) The username with this email was changed from "'.$oldUsername.'" to "'.$username.'" ';
		}
		if($isNewPassword){
			$body = $body.'*) The password with this email was changed ';
		}
		if($isNewEmail){
			$body = $body.'*) The email address was changed ';
			$b = 'You are receiving this because the account with this email was changed to a new address.';
			sendEmailBSFTH($oldEmail, $subject, $b);
		}
		sendEmailBSFTH($email, $subject, $body);
	}
}
function emailOnShiftSwapCreated($connection, $request_id){
	$request_id = mysql_real_escape_string($request_id);
	$query = 'select requests.created as request_created,shifts.user_id as owner_id, shifts.name as shift_name,shifts.time_begin as shift_begin,shifts.time_end as shift_end '.
			' from requests left outer join shifts on requests.shift_id=shifts.id where requests.id="'.$request_id.'";';
	$result = mysql_query($query);
	if($result && mysql_num_rows($result)==1){
		$row = mysql_fetch_assoc($result);
		$owner_id = $row["owner_id"];
		$shift_name = $row["shift_name"];
		$request_created = dateFromString($row["request_created"]);
		$shift_begin = dateFromString($row["shift_begin"]);
		$shift_end = dateFromString($row["shift_end"]);
		$subject = 'BSFTH Swap Request';
		$body = 'The following Shift Swap has been requested (at '.getHumanFullDateFromDate($request_created).'):  '.
		$shift_name.' : '.getHumanDayFromDate($shift_begin).', '.getHumanTimeOfDayFromDate($shift_begin).' - '.getHumanTimeOfDayFromDate($shift_end);
		mysql_free_result($result);
		$query = 'select id,username,email from users where (id="'.$owner_id.'" and preference_email_shift_self="1") or preference_email_shift_other="1";';
		$result = mysql_query($query);
		if($result){
			while($row = mysql_fetch_assoc($result)){
				$email = $row["email"];
				if( isValidEmail($email) ){
					sendEmailBSFTH($email, $subject, $body);
				}
			}
			mysql_free_result($result);
		}else{
			//error_log("could not send users data");
		}
		mysql_free_result($result);
	}
}
function emailOnShiftSwapFilled($connection, $request_id){
	$request_id = mysql_real_escape_string($request_id);
	$query = 'select requests.fulfill_date as request_fulfilled,requests.fulfill_user_id as filler_id,shifts.user_id as owner_id,shifts.name as shift_name,shifts.time_begin as shift_begin,shifts.time_end as shift_end '.
			' from requests left outer join shifts on requests.shift_id=shifts.id where requests.id="'.$request_id.'";';
	$result = mysql_query($query);
	if($result && mysql_num_rows($result)==1){
		$row = mysql_fetch_assoc($result);
		$owner_id = $row["owner_id"];
		$filler_id = $row["filler_id"];
		$shift_name = $row["shift_name"];
		$request_fulfilled = dateFromString($row["request_fulfilled"]);
		$shift_begin = dateFromString($row["shift_begin"]);
		$shift_end = dateFromString($row["shift_end"]);
		$subject = 'BSFTH Swap Filled';
		$body = 'The following Shift Swap has been filled (at '.getHumanFullDateFromDate($request_fulfilled).'):  '.
		$shift_name.' : '.getHumanDayFromDate($shift_begin).', '.getHumanTimeOfDayFromDate($shift_begin).' - '.getHumanTimeOfDayFromDate($shift_end);
		mysql_free_result($result);
		$query = 'select id,username,email from users where (id in ("'.$owner_id.'","'.$filler_id.'") and preference_email_shift_self="1") or preference_email_shift_other="1";';
		$result = mysql_query($query);
		if($result){
			while($row = mysql_fetch_assoc($result)){
				$email = $row["email"];
				if( isValidEmail($email) ){
					sendEmailBSFTH($email, $subject, $body);
				}
			}
			mysql_free_result($result);
		}else{
			//error_log("could not send users data on filled");
		}
		mysql_free_result($result);
	}
}
function emailOnShiftSwapUnFilled($connection, $request_id){
	$request_id = mysql_real_escape_string($request_id);
	$query = 'select requests.created as request_created,shifts.user_id as owner_id, shifts.name as shift_name,shifts.time_begin as shift_begin,shifts.time_end as shift_end '.
			' from requests left outer join shifts on requests.shift_id=shifts.id where requests.id="'.$request_id.'";';
	$result = mysql_query($query);
	if($result && mysql_num_rows($result)==1){
		$row = mysql_fetch_assoc($result);
		$owner_id = $row["owner_id"];
		$shift_name = $row["shift_name"];
		$request_created = dateFromString($row["request_created"]);
		$shift_begin = dateFromString($row["shift_begin"]);
		$shift_end = dateFromString($row["shift_end"]);
		$subject = 'BSFTH Swap Request';
		$body = 'The following Shift Swap has been un-filled (at '.getHumanFullDateFromDate( getDateNow() ).'):  '.
		$shift_name.' : '.getHumanDayFromDate($shift_begin).', '.getHumanTimeOfDayFromDate($shift_begin).' - '.getHumanTimeOfDayFromDate($shift_end);
		mysql_free_result($result);
		$query = 'select id,username,email from users where (id="'.$owner_id.'" and preference_email_shift_self="1") or preference_email_shift_other="1";';
		$result = mysql_query($query);
		if($result){
			while($row = mysql_fetch_assoc($result)){
				$email = $row["email"];
				if( isValidEmail($email) ){
					sendEmailBSFTH($email, $subject, $body);
				}
			}
			mysql_free_result($result);
		}else{
			//error_log("could not send users data");
		}
		mysql_free_result($result);
	}
}
function emailOnShiftSwapDecided($connection, $request_id, $approved){
	$decisionUpper = $approved==true?"Approved":"Declined";
	$decision = $approved==true?"approved":"declined";
	$request_id = mysql_real_escape_string($request_id);
	$query = 'select requests.approved_date as request_approved,requests.fulfill_user_id as filler_id,shifts.user_id as owner_id,shifts.name as shift_name,shifts.time_begin as shift_begin,shifts.time_end as shift_end '.
			' from requests left outer join shifts on requests.shift_id=shifts.id where requests.id="'.$request_id.'";';
	$result = mysql_query($query);
	if($result && mysql_num_rows($result)==1){
		$row = mysql_fetch_assoc($result);
		$owner_id = $row["owner_id"];
		$filler_id = $row["filler_id"];
		$shift_name = $row["shift_name"];
		$request_approved = dateFromString($row["request_approved"]);
		$shift_begin = dateFromString($row["shift_begin"]);
		$shift_end = dateFromString($row["shift_end"]);
		$subject = 'BSFTH Swap '.$decisionUpper;
		$body = 'The following Shift Swap has been '.$decision.' (at '.getHumanFullDateFromDate($request_approved).'):  '.
		$shift_name.' : '.getHumanDayFromDate($shift_begin).', '.getHumanTimeOfDayFromDate($shift_begin).' - '.getHumanTimeOfDayFromDate($shift_end);
		mysql_free_result($result);
		$query = 'select id,username,email from users where (id in ("'.$owner_id.'","'.$filler_id.'") and preference_email_shift_self="1") or preference_email_shift_other="1";';
		$result = mysql_query($query);
		if($result){
			while($row = mysql_fetch_assoc($result)){
				$email = $row["email"];
				if( isValidEmail($email) ){
					sendEmailBSFTH($email, $subject, $body);
				}
			}
			mysql_free_result($result);
		}else{
			//error_log("could not send users data on approve");
		}
		mysql_free_result($result);
	}
	// notify owner of shift where preference_email_shift_self=1
	// notify filler of request where preference_email_shift_self=1
	// notify all users where preference_email_shift_other=1
	//sendEmailBSFTH($email, $subject, $body);
}
function emailOnShiftSwapApproved($connection, $request_id){
	emailOnShiftSwapDecided($connection, $request_id, true);
}
function emailOnShiftSwapDenied($connection, $request_id){
	emailOnShiftSwapDecided($connection, $request_id, false);
}
function isValidEmail($email){
	$match = preg_match('/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{1,4}$/', strtoupper($email) );
	return ($match==1)?true:false;
}

// --------------------------------------------------------------------------------

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