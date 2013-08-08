<?php
// index.php
require "functions.php";
//include "config.php";

/*
http://localhost/alice/ff/src/volunteer/index.php?a=...
LOGIN: a=login | u=USERNAME | p=PASSWORD
//
?a=users&page=2&order=created
?a=user&key=username&value=richie
?a=shifts&page=3&start=20130701&end=20130801
?a=shift&key=userid&value=2&start=20130101&end=20140101
*/
$ACTION_TYPE_USERID = 'uid';
$ACTION_TYPE_SESSIONID = 'sid';
$ACTION_TYPE_LOGIN = 'login';
$ACTION_TYPE_SHIFT_CREATE = 'shift_create';
	$ACTION_TYPE_SHIFT_CREATE_START_DATE = 'start_date';
	$ACTION_TYPE_SHIFT_CREATE_END_DATE = 'end_date';
	$ACTION_TYPE_SHIFT_CREATE_REPEATING = 'repeat';
	$ACTION_TYPE_SHIFT_CREATE_POSITION = 'pid';
$ACTION_TYPE_CALENDAR = 'calendar';
	$ACTION_TYPE_CALENDAR_TYPE = 'type';
	$ACTION_TYPE_CALENDAR_DAY = 'day';
	$ACTION_TYPE_CALENDAR_WEEK = 'week';
	$ACTION_TYPE_CALENDAR_MONTH = 'month';
$ARGUMENT_GET_ACTION = $_GET['a'];
$ARGUMENT_VALUE_USERID = null;
$ARGUMENT_VALUE_SESSIONID = null;
//$ARGUMENT_POST_ACTION = $_POST['a'];

if($ARGUMENT_GET_ACTION!=null){
	$connection = mysql_connect("localhost","richie","qwerty") or die('{ "status": "error", "message": "connection failed" }'); 
	mysql_select_db("volunteering");
	if($ARGUMENT_GET_ACTION==$ACTION_TYPE_LOGIN){ // EVERYONE
		$username = mysql_real_escape_string($_POST['u']);
		$password = mysql_real_escape_string($_POST['p']);
		$query = 'select id,password from users where username="'.$username.'" limit 1;';
		$result = mysql_query($query, $connection);
		if($result){
			$total_results = mysql_num_rows($result);
			while($row = mysql_fetch_assoc($result)){
				if( $password == $row["password"] ){ // update sessions
					$id = $row["id"];
					// delete old session
					$query = 'delete from sessions where user_id = "'.$id.'";';
					$delete_result = mysql_query($query, $connection);
					if(mysql_errno()){ /* error */ }
					// set new session
					$session_id = randomSessionID();
					$ip_forward = $_SERVER['HTTP_X_FORWARDED_FOR'];
					$ip_remote = $_SERVER['REMOTE_ADDR'];
					$query = 'insert into sessions (user_id,session_id,ip_remote,ip_forward) values ("'.$id.'","'.$session_id.'","'.$ip_remote.'","'.$ip_forward.'");';
					$insert_result = mysql_query($query, $connection);
					if(mysql_errno()){
						echo '{ "status": "error", "message": "session fail" }';
					}else{
						echo '{ "status": "success", "username": "'.$username.'", "session_id": "'.$session_id.'" }';
					}
				}else{
					echo '{ "status": "error", "message": "login fail" }';
				}
				break;
			}
			if($total_results==0){
				echo '{ "status": "error", "message": "invalid combination" }';
			}
			mysql_free_result($result);
		}else{
			echo '{ "status": "error", "message": "invalid user" }';
		}
// PUBLIC -------------------------------------------------------------------
	}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_SHIFT_CREATE){
		$startDate = mysql_real_escape_string($_POST[$ACTION_TYPE_SHIFT_CREATE_START_DATE]);
		$endDate = mysql_real_escape_string($_POST[$ACTION_TYPE_SHIFT_CREATE_END_DATE]);
		$repeating = mysql_real_escape_string($_POST[$ACTION_TYPE_SHIFT_CREATE_REPEATING]);
		$position_id = mysql_real_escape_string($_POST[$ACTION_TYPE_SHIFT_CREATE_POSITION]);
		if( !($startDate&&$endDate&&$repeating&&$position_id) ){
			echo '{ "status": "error", "message": "missing arguments" }';
		}
		$children = computeDatePermutations($startDate,$endDate,$repeating);
		if($children!=null){
			$len = count($children);
			if($len>0){
				$userid = 0; // NEED REAL USER
				$query = 'insert into shifts (created, parent_id, user_id, position_id, time_begin, time_end, algorithm) values (now(),"0","'.$userid.'","'.$position_id.'","'.standardSQLDate($startDate).'","'.standardSQLDate($endDate).'","'.$repeating.'") ;';
				echo $query."\n";
				// INSERT IT
				// GET NEW PARENT ID
				$parent_id = "123";
				// FOR EACH CHILD, INSERT SHIFTS:
				for($i=0;$i<$len;++$i){
					$startTime = $children[$i][0];
					$endTime = $children[$i][1];
					$query = 'insert into shifts (created, parent_id, user_id, position_id, time_begin, time_end, algorithm) values (now(),"'.$parent_id.'","0","'.$position_id.'","'.standardSQLDate($startTime).'","'.standardSQLDate($endTime).'",null) ;';
					echo $query."\n";
					break;
				}
				//echo '{ "status": "success", "message": "..." }';
			}else{
				echo '{ "status": "error", "message": "no shifts" }';
			}
		}else{
			echo '{ "status": "error", "message": "invalid shift" }';
		}
		//echo '{ "status": "success", "message": "create shift...", "start":"'.$startDate.'", "end":"'.$endDate.'", "repeat":"'.$repeating.'" }';
		// $ACTION_TYPE_CALENDAR_TYPE
// PRIVATE -------------------------------------------------------------------
	}else{
		$ACTION_VALUE_USER_ID = mysql_real_escape_string($_POST[$ACTION_TYPE_USER_ID]);
		$ACTION_VALUE_SESSION_ID = mysql_real_escape_string($_POST[$ACTION_TYPE_SESSION_ID]);
		if($ACTION_VALUE_USER_ID==null || $ACTION_VALUE_USER_ID=="" || $ACTION_VALUE_SESSION_ID==null || $ACTION_VALUE_SESSION_ID==""){
			echo '{ "status": "error", "message": "no session info" }';
			return;
		}else{
			$query = 'select session_id from users where username="'.$ACTION_VALUE_USER_ID.'" limit 1;';
			$result = mysql_query($query, $connection);
			if($result && mysql_num_rows($result)==1){
				$row = mysql_fetch_assoc($result);
				$eq = $row["session_id"]==$ACTION_VALUE_SESSION_ID;
				mysql_free_result($result);
				if(!$eq){
					echo '{ "status": "error", "message": "invalid session" }';
				}
			}else{
				echo '{ "status": "error", "message": "no user" }';
				return;
			}
		}
		// USER -------------------------------------------------------------------
		if($ARGUMENT_GET_ACTION=="thisisaprivatefxn"){
			//
		// ADMIN -------------------------------------------------------------------			
		}else{
			//
		}
	}
	mysql_close($connection);
}else{

// ...

include "header.php";
includeHeader("Volunteering");


includeBody();

// TEST EMAIL


includeFooter();
}
?>
