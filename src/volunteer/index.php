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
//$ACTION_TYPE_USERID = 'uid';
$ACTION_TYPE_SESSION_ID = 'sid';
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
		$ACTION_TYPE_CALENDAR_DATE = 'date';
$ACTION_TYPE_POSITION_READ = 'position_read';
$ARGUMENT_GET_ACTION = $_GET['a'];
$ARGUMENT_VALUE_USERID = null;
$ARGUMENT_VALUE_SESSIONID = null;
//$ARGUMENT_POST_ACTION = $_POST['a'];

if($ARGUMENT_GET_ACTION!=null){
	$connection = mysql_connect("localhost","richie","qwerty") or die('{ "status": "error", "message": "connection failed" }'); 
	mysql_select_db("volunteering");
	if($ARGUMENT_GET_ACTION==$ACTION_TYPE_LOGIN){ // EVERYONE - // echo hash('sha512','qwerty')."\n"; = 0DD3E512642C97CA3F747F9A76E374FBDA73F9292823C0313BE9D78ADD7CDD8F72235AF0C553DD26797E78E1854EDEE0AE002F8ABA074B066DFCE1AF114E32F8
		$username = mysql_real_escape_string($_POST['u']);
		$password = mysql_real_escape_string($_POST['p']);
		$password = strtoupper($password);
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
						echo '{ "status": "success", "session_id": "'.$session_id.'" }'; //  "username": "'.$username.'", 
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
	
// PRIVATE -------------------------------------------------------------------
	}else{
		$ACTION_VALUE_USER_ID = null;
		$ACTION_VALUE_SESSION_ID = mysql_real_escape_string($_POST[$ACTION_TYPE_SESSION_ID]);
		if($ACTION_VALUE_SESSION_ID==null || $ACTION_VALUE_SESSION_ID==""){
			echo '{ "status": "error", "message": "no session info" }';
			return;
		}else{
			$query = 'select session_id,user_id from sessions where session_id="'.$ACTION_VALUE_SESSION_ID.'" limit 1;';
			$result = mysql_query($query, $connection);
			if($result && mysql_num_rows($result)==1){
				$row = mysql_fetch_assoc($result);
				$user_id = $row["user_id"];
				mysql_free_result($result);
				$ACTION_VALUE_USER_ID = $user_id;
				// valid session
				/*$query = 'select password from users where id="'.$user_id.'" limit 1;';
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
				}*/
				mysql_free_result($result);
			}else{
				echo '{ "status": "error", "message": "invalid session" }';
				return;
			}
		}
		// USER -------------------------------------------------------------------
		if($ARGUMENT_GET_ACTION=="thisisaprivatefxn"){
			// ...
		}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_SHIFT_CREATE){
				$startDate = mysql_real_escape_string($_POST[$ACTION_TYPE_SHIFT_CREATE_START_DATE]);
				$endDate = mysql_real_escape_string($_POST[$ACTION_TYPE_SHIFT_CREATE_END_DATE]);
				$repeating = mysql_real_escape_string($_POST[$ACTION_TYPE_SHIFT_CREATE_REPEATING]);
				$position_id = mysql_real_escape_string($_POST[$ACTION_TYPE_SHIFT_CREATE_POSITION]);
				if( !($startDate&&$endDate&&$repeating&&$position_id) ){
					echo '{ "status": "error", "message": "missing arguments" }';
				}
				// MAKE SURE POSITOIN EXISTS
				$query = 'select id from positions where id="'.$position_id.'" ;';
				$result = mysql_query($query, $connection);
				if($result && mysql_num_rows($result)==1 ){
					mysql_free_result($result);
				}else{
					echo '{ "status": "error", "message": "position not exist" }';
					return;
				}
//echo $startDate." ".$endDate." ".$repeating."\n";
				$children = computeDatePermutations($startDate,$endDate,$repeating);
//echo print_r($children),"\n";
				if($children!==null){
					$len = count($children);
					if($len>0){
						$startTime = dateFromString($startDate);
						$endTime = dateFromString($endDate);
						$userid = $ACTION_VALUE_USER_ID;
						$query = 'insert into shifts (created, parent_id, user_id, position_id, time_begin, time_end, algorithm) values (now(),"0","'.$userid.'","'.$position_id.'","'.standardSQLDateFromSeconds($startTime).'","'.standardSQLDateFromSeconds($endTime).'","'.$repeating.'") ;';
						#echo $query."\n";
						// INSERT IT
						$result = mysql_query($query, $connection);
						if(!$result){
							echo "ERROR-SUP";
							break;
						}
						// GET NEW PARENT ID
						$parent_id = intval( mysql_insert_id() );
						#echo $parent_id."\n";
						// FOR EACH CHILD, INSERT SHIFTS:
						for($i=0;$i<$len;++$i){
							$startTime = $children[$i][0];
							$endTime = $children[$i][1];
							$query = 'insert into shifts (created, parent_id, user_id, position_id, time_begin, time_end, algorithm) values (now(),"'.$parent_id.'","0","'.$position_id.'","'.standardSQLDateFromSeconds($startTime).'","'.standardSQLDateFromSeconds($endTime).'",null) ;';
							#echo $query."\n";
							$result = mysql_query($query, $connection);
							if(!$result){
								echo "ERROR-SUB"; // need correct handling
								break;
							}
						}
						echo '{ "status": "success", "message": "created '.($len).' singular shifts", "start": "'.$startTime.'" }';
					}else{
						echo '{ "status": "error", "message": "no shifts" }';
					}
				}else{
					echo '{ "status": "error", "message": "invalid shift" }';
				}
			}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_CALENDAR){ // ?a=calendar | type=week&date=2013-07-01
				$calType = mysql_real_escape_string($_POST[$ACTION_TYPE_CALENDAR_TYPE]);
				$calDate = mysql_real_escape_string($_POST[$ACTION_TYPE_CALENDAR_DATE]);
				$calTime = dateFromString($calDate);
				$calTime = getDayStartFromSeconds($calTime);
				$startDate = null; $endDate = null;
				$message = "";
				if($calType==$ACTION_TYPE_CALENDAR_DAY){
					$startDate = standardSQLDateFromSeconds( getDayStartFromSeconds($calTime) );
					$endDate = standardSQLDateFromSeconds( getDayEndFromSeconds($calTime) );
					$message = "day";
				}else if($calType==$ACTION_TYPE_CALENDAR_WEEK){
					$firstDayOfWeek = getFirstMondayOfWeek($calTime);
					$lastDayOfWeek = getLastSundayOfWeek($calTime);
					$startDate = standardSQLDateFromSeconds( getDayStartFromSeconds($firstDayOfWeek) );
					$endDate = standardSQLDateFromSeconds( getDayEndFromSeconds($lastDayOfWeek) );
					$message = "week";
				}else if($calType==$ACTION_TYPE_CALENDAR_MONTH){
					$firstDayOfMonth = getFirstDayOfMonth($calTime);
					$lastDayOfMonth = getLastDayOfMonth($calTime);
					$startDate = standardSQLDateFromSeconds( getDayStartFromSeconds($firstDayOfMonth) );
					$endDate = standardSQLDateFromSeconds( getDayEndFromSeconds($lastDayOfMonth) );
					$message = "month";
				}else{
					echo '{ "status": "error", "message": "invalid type" }';
					return;
				}
				$query = 'select id,parent_id,user_id,time_begin,time_end from shifts where time_begin between "'.$startDate.'" and "'.$endDate.'" order by time_begin asc; ';
				echo '{ "status": "success", "message": "'.$message.'", ';
				$result = mysql_query($query, $connection);
				if($result){
					$total_results = mysql_num_rows($result);
					$i = 0;
					echo '"total": '.$total_results.', "list": ['."\n";
					while($row = mysql_fetch_assoc($result)){
						$parent = $row["parent_id"];
						$user = $row["user_id"];
						$begin = $row["time_begin"];
						$end  = $row["time_end"];
						$position_id = $row["position_id"];
						echo '{ "begin": "'.$begin.'", "end": "'.$end.'", "parent": "'.$parent.'", "user": "'.$user.'", "position" : "'.$position_id.'" }';
						if($i<($total_results-1)){ echo ','; }
						echo "\n";
						++$i;
					}
					echo ']'."\n";
					mysql_free_result($result);
				}else{
					echo '"total": 0, "list": []';
				}
				echo ' }';
			}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_POSITION_READ){
				$query = "select id,user_id,created,modified,name,info from positions order by created desc";
				$result = mysql_query($query, $connection);
				if($result){
					$total_results = mysql_num_rows($result);
					$i = 0;
					echo '{ "status": "success", "message": "positions", "total": '.$total_results.', "list" : ['."\n";

					while($row = mysql_fetch_assoc($result)){
						$position_id = $row["id"];
						$name = $row["name"];
						$desc = $row["info"];
						echo '{ "name": "'.$name.'", "description": "'.$desc.'", "id": "'.$position_id.'"  }';
						if($i<($total_results-1)){ echo ','; }
						echo "\n";
						++$i;
					}
					echo '] }';
					mysql_free_result($result);
				}else{
					echo '{ "status": "success", "message": "empty", "total": 0, "list" : [] }';
				}





















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
