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
$ACTION_TYPE_SESSION_CHECK = "session";
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
$ACTION_TYPE_USER_GET = "user";
	$ACTION_TYPE_USER_GET_PAGE = "page";
	$ACTION_TYPE_USER_GET_COUNT = "count";
	$ACTION_TYPE_USER_GET_USER_ID = "uid";
	$ACTION_TYPE_USER_GET_TYPE = "type";
	$ACTION_TYPE_USER_GET_TYPE_SINGLE = "single";
	$ACTION_TYPE_USER_GET_TYPE_CURRENT = "current";
	$ACTION_TYPE_USER_GET_TYPE_LIST = "list";
$ACTION_TYPE_SHIFT_INFO = "shift";
	$ACTION_TYPE_SHIFT_INFO_ID = "id";
$ACTION_TYPE_REQUEST_GET = "req";
$ARGUMENT_GET_ACTION = $_GET['a'];
$ARGUMENT_VALUE_USERID = null;
$ARGUMENT_VALUE_SESSIONID = null;
//$ARGUMENT_POST_ACTION = $_POST['a'];
/*
	ServerVolunteerInterface.prototype.ACTION_USER_PAGE = "page";
	ServerVolunteerInterface.prototype.ACTION_USER_COUNT = "count";
	ServerVolunteerInterface.prototype.ACTION_USER_USER_ID = "type";
	ServerVolunteerInterface.prototype.ACTION_USER_TYPE = "type";
	ServerVolunteerInterface.prototype.ACTION_USER_TYPE_SINGLE = "single";
	ServerVolunteerInterface.prototype.ACTION_USER_TYPE_CURRENT = "current";
	ServerVolunteerInterface.prototype.ACTION_USER_TYPE_LIST = "list";
*/

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
	}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_SESSION_CHECK){
		$session_id = mysql_real_escape_string($_POST[$ACTION_TYPE_SESSION_ID]);
		$query = 'select session_id from sessions where session_id="'.$session_id.'" limit 1;';
		$result = mysql_query($query, $connection);
		if($result && mysql_num_rows($result)==1){
			echo '{ "status": "success", "message": "valid session" }';
			mysql_free_result($result);
		}else{
			echo '{ "status": "error", "message": "invalid session" }';
		}
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
			// 
		}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_USER_GET){
			$type = mysql_real_escape_string($_POST[$ACTION_TYPE_USER_GET_TYPE]);
			if($type==$ACTION_TYPE_USER_GET_TYPE_CURRENT || $type==$ACTION_TYPE_USER_GET_TYPE_SINGLE){
				$user_id = $ACTION_VALUE_USER_ID;
				$message = "current";
				if($type==$ACTION_TYPE_USER_GET_TYPE_SINGLE){
					$user_id = mysql_real_escape_string($_POST[$ACTION_TYPE_USER_GET_USER_ID]);
					$message = "single";
				}
				//$query = 'select id,group_id,created,modified,username,first_name,last_name,email,phone,city,state,zip from users where id="'.$user_id.'" limit 1;';
				$query = 'select users.id,users.group_id,users.created,users.modified,users.username,users.first_name,users.last_name,users.email,users.phone,users.city,users.state,users.zip,groups.name as group_name   from users right outer join groups on users.group_id=groups.id  where users.id="'.$user_id.'" limit 1;';
				$result = mysql_query($query, $connection);
				if($result && mysql_num_rows($result)==1 ){
					$row = mysql_fetch_assoc($result);
					$user_id = $row["id"];
					$group_id = $row["group_id"];
						$group_name = $row["group_name"];
					$created = $row["created"];
					$modified = $row["modified"];
					$username = $row["username"];
					$first_name = $row["first_name"];
					$last_name = $row["last_name"];
					$email = $row["email"];
					$phone = $row["phone"];
					$city = $row["city"];
					$state = $row["state"];
					$zip = $row["zip"];
					echo '{"status": "success", "message": "'.$message.'", "user": '."\n".'{';
					echo '"id":"'.$user_id.'", "group_id":"'.$group_id.'", "group_name":"'.$group_name.'", "created":"'.$created.'","modified":"'.$modified.'", "username":"'.$username.'", ';
					echo '"first_name":"'.$first_name.'","last_name":"'.$last_name.'","email":"'.$email.'","phone":"'.$phone.'", ';
					echo '"city":"'.$city.'","state":"'.$state.'","zip":"'.$zip.'" ';
					echo '}'."\n".'}';
					mysql_free_result($result);
				}else{
					echo '{ "status": "error", "message": "user not exist" }';
					return;
				}
			}else if($type==$ACTION_TYPE_USER_GET_TYPE_LIST){
				$page = mysql_real_escape_string($_POST[$ACTION_TYPE_USER_GET_PAGE]); $page = $page==""?0:$page;
				$count = mysql_real_escape_string($_POST[$ACTION_TYPE_USER_GET_COUNT]);
				$count = max(min($count,100),1);
				$offset = max(0,$count*($page));
				$query = 'select id,group_id,created,modified,username,first_name,last_name,email,phone,city,state,zip from users   order by created  limit '.$count.' offset '.$offset.';';
				$result = mysql_query($query, $connection);
				if($result){
					$total = mysql_num_rows($result);
					echo '{"status": "success", "message": "list", "page": '.$page.', "count":'.$count.', "total": '.$total.', "list": ['."\n";
					while( $row = mysql_fetch_assoc($result) ){
						$user_id = $row["id"];
						$group_id = $row["group_id"];
						$created = $row["created"];
						$modified = $row["modified"];
						$username = $row["username"];
						$first_name = $row["first_name"];
						$last_name = $row["last_name"];
						$email = $row["email"];
						$phone = $row["phone"];
						$city = $row["city"];
						$state = $row["state"];
						$zip = $row["zip"];
						echo '{';
						echo '"id":"'.$user_id.'", "group_id":"'.$group_id.'", "created":"'.$created.'","modified":"'.$modified.'", "username":"'.$username.'", ';
						echo '"first_name":"'.$first_name.'","last_name":"'.$last_name.'","email":"'.$email.'","phone":"'.$phone.'", ';
						echo '"city":"'.$city.'","state":"'.$state.'","zip":"'.$zip.'" ';
						echo '}';
						if($i<($total-1)){ echo ','; }
						echo "\n";
					}
					echo '] }';
				}else{
					echo '{"status": "error", "message": "bad search"}';
				}
			}else{
				echo '{"status": "error", "message": "unknown action"}';
			}
		// CREATE REQUEST
		}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_REQUEST_GET){
			$page = mysql_real_escape_string($_POST[$ACTION_TYPE_USER_GET_PAGE]); $page = $page==""?0:$page;
			$count = mysql_real_escape_string($_POST[$ACTION_TYPE_USER_GET_COUNT]);
			$count = max(min($count,100),1);
			$offset = max(0,$count*($page));
			$query = 'select id,created,modified,shift_id,request_user_id,fulfill_user_id,approved_user_id,info,status  from requests  order by approved_user_id asc, created desc limit '.$count.' offset '.$offset.';';
			// select requests.
			$result = mysql_query($query, $connection);
			if($result){
				$total = mysql_num_rows($result);
				echo '{"status": "success", "message": "list", "page": '.$page.', "count":'.$count.', "total": '.$total.', "list": ['."\n";
				while( $row = mysql_fetch_assoc($result) ){
					$request_id = $row["id"];
					$created = $row["created"];
					$modified = $row["modified"];
					$shift_id = $row["shift_id"];
					$request_user_id = $row["request_user_id"];
					$fulfill_user_id = $row["fulfill_user_id"];
					$approved_user_id = $row["approved_user_id"];
					$info = $row["info"];
					$status = $row["status"];
					echo '{';
					echo '"id":"'.$request_id.'", "created":"'.$created.'","modified":"'.$modified.'", "shift_id":"'.$shift_id.'", ';
					echo '"request_user_id ":"'.$request_user_id .'", "fulfill_user_id":"'.$fulfill_user_id.'", "approved_user_id":"'.$approved_user_id.'", ';
					echo '"info":"'.$info.'", "status":"'.$status.'" ';
					echo '}';
					if($i<($total-1)){ echo ','; }
					echo "\n";
				}
				echo '] }';
			}else{
				echo '{"status": "error", "message": "bad search"}';
			}
		// APPROVE/DENY REQUEST
/*
+------------------+---------------+------+-----+---------+----------------+
| Field            | Type          | Null | Key | Default | Extra          |
+------------------+---------------+------+-----+---------+----------------+
| id               | int(11)       | NO   | PRI | NULL    | auto_increment |
| created          | datetime      | YES  |     | NULL    |                |
| modified         | datetime      | YES  |     | NULL    |                |
| shift_id         | int(11)       | YES  |     | NULL    |                |
| request_user_id  | int(11)       | YES  |     | NULL    |                |
| fulfill_user_id  | int(11)       | YES  |     | NULL    |                |
| approved_user_id | int(11)       | YES  |     | NULL    |                |
| info             | varchar(1024) | YES  |     | NULL    |                |
| status           | int(11)       | YES  |     | NULL    |                |
+------------------+---------------+------+-----+---------+----------------+

*/
		}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_SHIFT_INFO){
			$shift_id = mysql_real_escape_string($_POST[$ACTION_TYPE_SHIFT_INFO_ID]);
			//$query = 'select id,created,parent_id,user_id,position_id,time_begin,time_end,algorithm from positions where id="'.$shift_id.'" limit 1;';
			$query = 'select shifts.id,shifts.created,shifts.parent_id,shifts.user_id,shifts.position_id,shifts.time_begin,shifts.time_end,shifts.algorithm,users.username,positions.name as position_name from shifts  left outer join users on users.id=shifts.user_id    left outer join positions on positions.id=shifts.position_id   where shifts.id="'.$shift_id.'"  limit 1;';
			$result = mysql_query($query, $connection);
			if($result){
				if( mysql_num_rows($result)==1 ){
					$row = mysql_fetch_assoc($result);
					$shift_id = $row["id"];
					$user_id = $row["user_id"];
						$username = $row["username"];
					$created = $row["created"];
					$parent_id = $row["parent_id"];
					$position_id = $row["position_id"];
						$position_name = $row["position_name"];
					$time_begin = $row["time_begin"];
					$time_end = $row["time_end"];
					$algorithm = $row["algorithm"];
					echo '{ "status": "success", "message": "shift", "shift": {'."\n";
					echo '"id": "'.$shift_id.'", "user_id": "'.$user_id.'", "username": "'.$username.'", "created": "'.$created.'", "position_id": "'.$position_id.'", "position_name": "'.$position_name.'", "time_begin": "'.$time_begin.'", "time_end": "'.$time_end.'", "algorithm": "'.$algorithm.'", "parent_id": "'.$parent_id.'", '."\n";
					mysql_free_result($result);
					if($parent_id!=0){ // next search - same query on parent
						$shift_id = $parent_id;
						$query = 'select shifts.id,shifts.created,shifts.parent_id,shifts.user_id,shifts.position_id,shifts.time_begin,shifts.time_end,shifts.algorithm,users.username,positions.name as position_name from shifts  left outer join users on users.id=shifts.user_id    left outer join positions on positions.id=shifts.position_id   where shifts.id="'.$shift_id.'"  limit 1;';
						$result = mysql_query($query, $connection);
						if($result && mysql_num_rows($result)==1){
							$row = mysql_fetch_assoc($result);
							$shift_id = $row["id"];
							$user_id = $row["user_id"];
								$username = $row["username"];
							$created = $row["created"];
							$parent_id = $row["parent_id"];
							$position_id = $row["position_id"];
								$position_name = $row["position_name"];
							$time_begin = $row["time_begin"];
							$time_end = $row["time_end"];
							$algorithm = $row["algorithm"];
							echo '"parent": { ';
							echo '"id": "'.$shift_id.'", "user_id": "'.$user_id.'", "username": "'.$username.'", "created": "'.$created.'", "position_id": "'.$position_id.'", "position_name": "'.$position_name.'", "time_begin": "'.$time_begin.'", "time_end": "'.$time_end.'", "algorithm": "'.$algorithm.'", "parent_id": "'.$parent_id.'" '."\n";
							echo ' }'."\n";
							mysql_free_result($result);
						}else{
							echo '"parent": null '."\n";
						}
					}else{
						echo '"parent": null '."\n";
					}
					echo '} }';
				}else{
					echo '{ "status": "error", "message": "unknown shift id" }';
				}
				
			}else{
				echo '{ "status": "error", "message": "bad search" }';
			}
		}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_SHIFT_CREATE){
				$startDate = mysql_real_escape_string($_POST[$ACTION_TYPE_SHIFT_CREATE_START_DATE]);
				$endDate = mysql_real_escape_string($_POST[$ACTION_TYPE_SHIFT_CREATE_END_DATE]);
				$repeating = mysql_real_escape_string($_POST[$ACTION_TYPE_SHIFT_CREATE_REPEATING]);
				$position_id = mysql_real_escape_string($_POST[$ACTION_TYPE_SHIFT_CREATE_POSITION]);
				if( !($startDate&&$endDate&&$repeating&&$position_id) ){
					echo '{ "status": "error", "message": "missing arguments" }';
				}
				// MAKE SURE POSITION EXISTS
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
					$firstChildStartTime = "";
					$len = count($children);
					if($len>0){
						$startTime = dateFromString($startDate);
						$endTime = dateFromString($endDate);
						#echo $startTime." - ".$endTime."\n";
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
							if($i==0){
								$firstChildStartTime = $startTime;//stringFromDate($startTime);
							}
							$query = 'insert into shifts (created, parent_id, user_id, position_id, time_begin, time_end, algorithm) values (now(),"'.$parent_id.'","0","'.$position_id.'","'.standardSQLDateFromSeconds($startTime).'","'.standardSQLDateFromSeconds($endTime).'",null) ;';
							#echo $query."\n";
							$result = mysql_query($query, $connection);
							if(!$result){
								echo "ERROR-SUB"; // need correct handling
								break;
							}
						}
						echo '{ "status": "success", "message": "created '.($len).' singular shifts", "start": "'.$startTime.'", "first": "'.$firstChildStartTime.'" }';
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
#echo $startDate."\n";
#echo $endDate."\n";
				//$query = 'select id,parent_id,user_id,time_begin,time_end,position_id from shifts where time_begin between "'.$startDate.'" and "'.$endDate.'" order by time_begin asc; ';
				$query = 'select shifts.id,shifts.parent_id,shifts.user_id,shifts.time_begin,shifts.time_end,shifts.position_id,users.username from shifts   left outer join users on shifts.user_id=users.id    where parent_id!=0 and shifts.time_begin between "'.$startDate.'" and "'.$endDate.'" order by time_begin asc; ';
				echo '{ "status": "success", "message": "'.$message.'", ';
				$result = mysql_query($query, $connection);
				if($result){
					$total_results = mysql_num_rows($result);
					$i = 0;
					echo '"total": '.$total_results.', "list": ['."\n";
					while($row = mysql_fetch_assoc($result)){
						$parent_id = $row["parent_id"];
						$user_id = $row["user_id"];
						$username = $row["username"];
							/*$username = "";
							if($user_id!=0){
								$query = 'select username from users where id="'.$user_id.'" limit 1;';
								$res = mysql_query($query, $connection);
								$r = mysql_fetch_assoc($res);
								$username = $r["username"];
								mysql_free_result($res);
							}*/
						$begin = $row["time_begin"];
						$end  = $row["time_end"];
						$position_id = $row["position_id"];
						$shift_id = $row["id"];
						echo '{ "begin": "'.$begin.'", "end": "'.$end.'", "parent": "'.$parent_id.'", "user_id": "'.$user_id.'", "username": "'.$username.'", "position" : "'.$position_id.'", "id" : "'.$shift_id.'" }';
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
				$query = "select id,user_id,created,modified,name,info from positions order by created asc, id asc;";
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
