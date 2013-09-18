<?php
// index.php
require "functions.php";
//include "config.php";

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
	$ACTION_TYPE_CALENDAR_OPTION = 'option';
		$ACTION_TYPE_CALENDAR_OPTION_SELF = 'self';
		$ACTION_TYPE_CALENDAR_OPTION_NONE = 'none';
$ACTION_TYPE_POSITION_READ = 'position_read';
$ACTION_TYPE_POSITION_SINGLE_CREATE = "position_single_create";
$ACTION_TYPE_POSITION_SINGLE_READ = "position_single_read";
$ACTION_TYPE_POSITION_SINGLE_UPDATE = "position_single_update";
$ACTION_TYPE_POSITION_SINGLE_DELETE = "position_single_delete";
$ACTION_TYPE_POSITION_SINGLE_ID = "id";
$ACTION_TYPE_POSITION_SINGLE_NAME = "name";
$ACTION_TYPE_POSITION_SINGLE_INFO = "info";
$ACTION_TYPE_USER_SIMPLE_GET= "user_simple";
$ACTION_TYPE_USER_GET = "user";
	$ACTION_TYPE_USER_GET_PAGE = "page";
	$ACTION_TYPE_USER_GET_COUNT = "count";
	$ACTION_TYPE_USER_GET_USER_ID = "uid";
	$ACTION_TYPE_USER_GET_TYPE = "type";
	$ACTION_TYPE_USER_GET_TYPE_SINGLE = "single";
	$ACTION_TYPE_USER_GET_TYPE_CURRENT = "current";
	$ACTION_TYPE_USER_GET_TYPE_LIST = "list";
$ACTION_TYPE_USER_CREATE = "user_create";
$ACTION_TYPE_USER_UPDATE = "user_update";
$ACTION_TYPE_USER_DELETE = "user_delete";
	$ACTION_TYPE_USER_USER_ID = "uid";
	$ACTION_TYPE_USER_USERNAME = "username";
	$ACTION_TYPE_USER_FIRST_NAME = "first_name";
	$ACTION_TYPE_USER_LAST_NAME = "last_name";
	$ACTION_TYPE_USER_EMAIL = "email";
	$ACTION_TYPE_USER_PHONE = "phone";
	$ACTION_TYPE_USER_ADDRESS = "address";
	$ACTION_TYPE_USER_CITY = "city";
	$ACTION_TYPE_USER_STATE = "state";
	$ACTION_TYPE_USER_ZIP = "zip";
	$ACTION_TYPE_USER_GROUP_ID = "group_id";
	$ACTION_TYPE_USER_ADMIN_PASSWORD = "admin_password";
	$ACTION_TYPE_USER_NEW_PASSWORD = "new_password";
	$ACTION_TYPE_USER_CONFIRM_PASSWORD = "confirm_password";
$ACTION_TYPE_SHIFT_INFO = "shift";
	$ACTION_TYPE_SHIFT_INFO_ID = "id";
$ACTION_TYPE_SHIFT_LIST = "shift_list";
$ACTION_TYPE_REQUEST_GET = "req";
$ACTION_TYPE_REQUEST_CREATE = "request_create";
$ACTION_TYPE_REQUEST_UPDATE_ANSWER = "request_answer";
$ACTION_TYPE_REQUEST_UPDATE_DECIDE = "request_decide";
	$ACTION_TYPE_REQUEST_SHIFT_ID = "shift_id";
	$ACTION_TYPE_REQUEST_REQUEST_ID = "request_id";
	$ACTION_TYPE_REQUEST_TYPE = "type";
	$ACTION_TYPE_REQUEST_YES = "yes";
	$ACTION_TYPE_REQUEST_NO = "no";

$ACTION_TYPE_SHIFT_UPDATE_USER_SINGLE = "shift_user_single";
$ACTION_TYPE_SHIFT_UPDATE_USER_EMPTY = "shift_user_empty";
$ACTION_TYPE_SHIFT_UPDATE_USER_ALL = "shift_user_all";
$ACTION_TYPE_SHIFT_UPDATE_USER_FUTURE = "shift_user_future";
	$ACTION_TYPE_SHIFT_UPDATE_USER_ID = "user_id";
	$ACTION_TYPE_SHIFT_UPDATE_SHIFT_ID = "shift_id";

$ACTION_TYPE_SHIFT_DELETE_SHIFT = "shift_delete";
	$ACTION_TYPE_SHIFT_DELETE_SHIFT_ID = "shift_id";

$ACTION_TYPE_GROUP_GET = "group";
//
$ARGUMENT_GET_ACTION = $_GET['a'];
//
$LOG_TYPE_LOGIN = "login";
$LOG_TYPE_LOGOUT = "logout";


if($ARGUMENT_GET_ACTION!=null){
	$connection = mysql_connect("localhost","richie","qwerty") or die('{ "status": "error", "message": "connection failed" }'); 
	mysql_select_db("volunteering");
	if($ARGUMENT_GET_ACTION==$ACTION_TYPE_LOGIN){ // EVERYONE - // echo hash('sha512','qwerty')."\n"; = 0DD3E512642C97CA3F747F9A76E374FBDA73F9292823C0313BE9D78ADD7CDD8F72235AF0C553DD26797E78E1854EDEE0AE002F8ABA074B066DFCE1AF114E32F8
		$username = decode_real_escape_string($_POST['u']);
		$password = decode_real_escape_string($_POST['p']);
		$password = strtoupper($password);
		$query = 'select id,password from users where username="'.$username.'" limit 1;';
		$result = mysql_query($query, $connection);
		if($result){
			$total_results = mysql_num_rows($result);
			while($row = mysql_fetch_assoc($result)){
				if( $password == $row["password"] ){ // update sessions
					$uid = $row["id"];
					// delete all old sessions
					$query = 'delete from sessions where user_id = "'.$uid.'";';
					$delete_result = mysql_query($query, $connection);
					if(mysql_errno()){ /* error */ }
					// set new session
					$session_id = randomSessionID();
					$ip_forward = $_SERVER['HTTP_X_FORWARDED_FOR'];
					$ip_remote = $_SERVER['REMOTE_ADDR'];
					$query = 'insert into sessions (created, user_id,session_id,ip_remote,ip_forward) values (now(), "'.$uid.'","'.$session_id.'","'.$ip_remote.'","'.$ip_forward.'");';
					$insert_result = mysql_query($query, $connection);
					if(mysql_errno()){
						echo '{ "status": "error", "message": "session fail" }';
					}else{
						echo '{ "status": "success", "session_id": "'.$session_id.'" }';
						logEventDB($connection, $uid,$LOG_TYPE_LOGIN,$ip_forward."|".$ip_remote);
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
	}else{ // MUST BE LOGGED IN
		$ACTION_VALUE_USER_ID = null;
		$ACTION_VALUE_IS_ADMIN = false;
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
				//
				$query = 'select name from groups where id=(select group_id from users where id="'.$ACTION_VALUE_USER_ID.'");';
				$result = mysql_query($query, $connection);
				if($result && mysql_num_rows($result)==1){
					$row = mysql_fetch_assoc($result);
					$group_name = $row["name"];
					$ACTION_VALUE_IS_ADMIN = $group_name=="admin";
					mysql_free_result($result);
				}else{
					echo '{ "status": "error", "message": "invalid group" }';
				}
			}else{
				echo '{ "status": "error", "message": "invalid session" }';
				return;
			}
		}
		// USER -------------------------------------------------------------------
		if($ARGUMENT_GET_ACTION==$ACTION_TYPE_USER_SIMPLE_GET){
			$query = 'select id,username from users order by username asc limit 1000;';
			$result = mysql_query($query, $connection);
			if($result){
				$total = mysql_num_rows($result);
				$i = 0;
				echo '{ "status": "success", "message": "users found", "total":"'.$total.'", "list": ['."\n";
				while( $row = mysql_fetch_assoc($result) ){
					$user_id = $row["id"];
					$username = $row["username"];
					echo '{ "id": "'.$user_id.'", "username": "'.$username.'" }';
					if($count<$total-1){
						echo ',';
					}
					echo "\n";
					++$count;
				}
				echo '] }';
				mysql_free_result($result);
			}else{
				echo '{ "status": "error", "message": "bad search" }';
			}
		}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_USER_GET){
			$type = mysql_real_escape_string($_POST[$ACTION_TYPE_USER_GET_TYPE]);
			if($type==$ACTION_TYPE_USER_GET_TYPE_CURRENT || $type==$ACTION_TYPE_USER_GET_TYPE_SINGLE){
				$user_id = $ACTION_VALUE_USER_ID;
				$message = "current";
				if($type==$ACTION_TYPE_USER_GET_TYPE_SINGLE){
					$user_id = mysql_real_escape_string($_POST[$ACTION_TYPE_USER_GET_USER_ID]);
					$message = "single";
				}
				$query = 'select users.id,users.group_id,users.created,users.modified,users.username,users.first_name,users.last_name,users.email,users.phone,users.address,users.city,users.state,users.zip,groups.name as group_name   from users right outer join groups on users.group_id=groups.id  where users.id="'.$user_id.'" limit 1;';
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
					$address = $row["address"];
					$city = $row["city"];
					$state = $row["state"];
					$zip = $row["zip"];
					echo '{"status": "success", "message": "'.$message.'", "user": '."\n".'{';
					echo '"id":"'.$user_id.'", "group_id":"'.$group_id.'", "group_name":"'.$group_name.'", "created":"'.$created.'","modified":"'.$modified.'", "username":"'.$username.'", ';
					echo '"first_name":"'.$first_name.'","last_name":"'.$last_name.'","email":"'.$email.'","phone":"'.$phone.'", ';
					echo '"address":"'.$address.'","city":"'.$city.'","state":"'.$state.'","zip":"'.$zip.'" ';
					echo '}'."\n".'}';
					mysql_free_result($result);
				}else{
					echo '{ "status": "error", "message": "user not exist" }';
					return;
				}
			}else if($type==$ACTION_TYPE_USER_GET_TYPE_LIST){
				$page = mysql_real_escape_string($_POST[$ACTION_TYPE_USER_GET_PAGE]); $page = $page==""?0:$page;
					$page = intval($page);
				$count = mysql_real_escape_string($_POST[$ACTION_TYPE_USER_GET_COUNT]);
					$count = intval($count);
				$count = max(min($count,100),1);
				$offset = max(0,$count*($page));
				$query = 'select users.id as id,group_id,name as group_name,created,modified,username,first_name,last_name,email,phone,address,city,state,zip from users right outer join groups on users.group_id=groups.id   order by created asc, id asc  limit '.$count.' offset '.$offset.';';
				$result = mysql_query($query, $connection);
				if($result){
					$total = mysql_num_rows($result);
					echo '{"status": "success", "message": "list", "page": '.$page.', "count":'.$count.', "total": '.$total.', "list": ['."\n";
					while( $row = mysql_fetch_assoc($result) ){
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
						$address = $row["address"];
						$city = $row["city"];
						$state = $row["state"];
						$zip = $row["zip"];
						echo '{';
						echo '"id":"'.$user_id.'", "group_id":"'.$group_id.'", "group_name":"'.$group_name.'", "created":"'.$created.'","modified":"'.$modified.'", "username":"'.$username.'", ';
						echo '"first_name":"'.$first_name.'","last_name":"'.$last_name.'","email":"'.$email.'","phone":"'.$phone.'", ';
						echo '"address":"'.$address.'","city":"'.$city.'","state":"'.$state.'","zip":"'.$zip.'" ';
						echo '}';
						if($i<($total-1)){ echo ','; }
						++$i;
						echo "\n";
					}
					mysql_free_result($result);
					$query = 'select count(*) as count from users;';
					$result = mysql_query($query, $connection);
					$row = mysql_fetch_assoc($result);
					$total_rows = $row["count"];
					mysql_free_result($result);
					echo '], ';
					echo '"absolute": "'.$total_rows.'"';
					echo '}';
				}else{
					echo '{"status": "error", "message": "bad search"}';
				}
			}else{
				echo '{"status": "error", "message": "unknown action"}';
			}
		// CREATE REQUEST
		}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_REQUEST_GET){
			autoSetRequestToEmptyOnTimePass($connection);
			$page = mysql_real_escape_string($_POST[$ACTION_TYPE_USER_GET_PAGE]); $page = $page==""?0:$page;
			$count = mysql_real_escape_string($_POST[$ACTION_TYPE_USER_GET_COUNT]);
			$count = max(min($count,100),1);
			$offset = max(0,$count*($page));
			$query =
			'select request_id, created,fulfill_date,approved_date, shift_id, shift_begin, shift_end, position_id, position_name, owner_id, owner_username, requester_id, requester_username, fulfiller_id, fulfiller_username, approver_id, approver_username, info, status from'.
			' (select * from'
				.
			' (select id as request_id, created,fulfill_date,approved_date, shift_id, request_user_id as requester_id, fulfill_user_id as fulfiller_id, approved_user_id as approver_id, info, status from requests) as R0'.
			' left outer join'.
			' (select id, user_id as owner_id, time_begin as shift_begin, time_end as shift_end, position_id as position_id from shifts) as S0'.
			' on R0.shift_id=S0.id)'.
			' as R1'.

			' left outer join'.
			' (select id, username as requester_username from users) as U1'.
			' on R1.requester_id=U1.id'.

			' left outer join'.
			' (select id, username as fulfiller_username from users) as U2'.
			' on R1.fulfiller_id=U2.id'.

			' left outer join'.
			' (select id, username as approver_username from users) as U3'.
			' on R1.approver_id=U3.id'.

			' left outer join'.
			' (select id, username as owner_username from users) as U4'.
			' on R1.owner_id=U4.id'.

			' left outer join'.
			' (select id, name as position_name from positions) as P1'.
			' on R1.position_id=P1.id'.
			' order by status asc, created desc limit '.$count.' offset '.$offset.';';
			$result = mysql_query($query, $connection);
			if($result){
				$total = mysql_num_rows($result);
				echo '{"status": "success", "message": "list", "page": '.$page.', "count":'.$count.', "total": '.$total.', "list": ['."\n";
				$i = 0;
				while( $row = mysql_fetch_assoc($result) ){
					$request_id = $row["request_id"];
					$shift_id = $row["shift_id"];
					$shift_begin = $row["shift_begin"];
					$shift_end = $row["shift_end"];
					$position_id = $row["position_id"];
					$position_name = $row["position_name"];
					$owner_id = $row["owner_id"];
					$requester_id = $row["requester_id"];
						$created = $row["created"];
					$fulfiller_id = $row["fulfiller_id"];
						$filled = $row["fulfill_date"];
					$approver_id = $row["approver_id"];
						$approved = $row["approved_date"];
					$owner_username = $row["owner_username"];
					$requester_username = $row["requester_username"];
					$fulfiller_username = $row["fulfiller_username"];
					$approver_username = $row["approver_username"];
					$info = $row["info"];
					$status = $row["status"];
					// ","modified":"'.$modified.'", 
					echo '{';
					echo '"request_id":"'.$request_id.'", "created":"'.$created.'", "shift_id":"'.$shift_id.'", "shift_begin":"'.$shift_begin.'", "shift_end":"'.$shift_end.'", ';
					echo '"position_id":"'.$position_id.'", "position_name":"'.$position_name.'", ';
					echo '"owner_id":"'.$owner_id.'", "requester_id":"'.$requester_id .'", "fulfiller_id":"'.$fulfiller_id.'", "approver_id":"'.$approver_id.'", ';
					echo '"approved_date":"'.$approved.'", "fulfilled_date":"'.$filled.'", ';
					echo '"owner_username":"'.$owner_username.'", "requester_username":"'.$requester_username .'", "fulfiller_username":"'.$fulfiller_username.'", "approver_username":"'.$approver_username.'", ';
					echo '"info":"'.$info.'", "status":"'.$status.'" ';
					echo '}';
					if($i<($total-1)){ echo ','; }
					echo "\n";
					++$i;
				}
				echo '] }';
			}else{
				echo '{"status": "error", "message": "bad search"}';
			}
		}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_REQUEST_CREATE){
			$shift_id = mysql_real_escape_string($_POST[$ACTION_TYPE_REQUEST_SHIFT_ID]);
			//$user_id = mysql_real_escape_string($_POST[$ACTION_TYPE_REQUEST_USER_ID]);
			$user_id = $ACTION_VALUE_USER_ID; // use logged-in value
			if($user_id<=0 || $shift_id<=0){
				echo '{ "status": "error", "message": "invalid id" }';
				return;
			}
			$query = 'select id from requests where shift_id="'.$shift_id.'" and status="0";';
			$result = mysql_query($query,$connection);
			if($result){
				$total = mysql_num_rows($result);
				mysql_free_result($result);
				if($total==0){
					$query = 'insert into requests (created,shift_id,request_user_id,fulfill_user_id,fulfill_date,approved_user_id,approved_date,info,status) values (now(),"'.$shift_id.'","'.$user_id.'","0",NULL,"0",NULL,"","0"); ';
					$result = mysql_query($query,$connection);
					if($result){
						$request_id = intval( mysql_insert_id() );
						mysql_free_result($result);
						$query = 'select time_begin,time_end from shifts where id="'.$shift_id.'" limit 1;';
						$result = mysql_query($query,$connection);
						if($result && mysql_num_rows($result)==1){
							$row = mysql_fetch_assoc($result);
							$time_begin = $row["time_begin"];
							$time_end = $row["time_end"];
							mysql_free_result($result);
							echo '{"status": "success", "message": "request created", "request": { "id": "'.$request_id.'", "request_user_id": "'.$user_id.'", ';
							echo '"shift_id": "'.$shift_id.'", "time_begin": "'.$time_begin.'", "time_end": "'.$time_end.'" } }';
						}else{
							echo '{"status": "error", "message": "recheck failed"}';
						}
					}else{
						echo '{"status": "error", "message": "create failed"}';
					}
				}else{
					echo '{"status": "error", "message": "only one open request per shift allowed"}';
				}
			}else{
				echo '{"status": "error", "message": "unknown"}';
			}
		}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_REQUEST_UPDATE_ANSWER){
			$request_id = mysql_real_escape_string($_POST[$ACTION_TYPE_REQUEST_REQUEST_ID]);
			$user_id = $ACTION_VALUE_USER_ID;
			if($user_id>0 || $shift_id>0){
				$query = 'select shift_id,request_user_id,fulfill_user_id,approved_user_id,status from requests where id="'.$request_id.'" limit 1;';
				$result = mysql_query($query);
				if($result && mysql_num_rows($result)==1){
					$row = mysql_fetch_assoc($result);
					$shift_id = intval($row["shift_id"]);
					$request_status = intval($row["status"]);
					$request_user_id = intval($row["request_user_id"]);
					$fulfill_user_id = intval($row["fulfill_user_id"]);
					mysql_free_result($result);
					if($request_status==0){
						if($fulfill_user_id==0){
							$query = 'update requests set fulfill_user_id="'.$user_id.'",fulfill_date=now(), status="1" where id="'.$request_id.'";';
							$result = mysql_query($query);
							if($result){
								echo '{"status": "success", "message": "request filled", "request": {"id": "'.$request_id.'", "shift_id": "'.$shift_id.'", ';
								echo '"request_user_id": "'.$request_user_id.'", "fulfill_user_id": "'.$user_id.'" }}';
							}else{
								echo '{"status": "error", "message": "update failed '.mysql_real_escape_string($query).' "}';
							}
						}else{
							echo '{"status": "error", "message": "request has been filled"}';
						}
					}else{
						echo '{"status": "error", "message": "request closed"}';
					}
				}else{
					echo '{"status": "error", "message": "request does not exist"}';
				}
			}else{
 				echo '{ "status": "error", "message": "invalid id" }';
 			}
		}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_REQUEST_UPDATE_DECIDE){
			$user_id = $ACTION_VALUE_USER_ID;
			$request_id = mysql_real_escape_string($_POST[$ACTION_TYPE_REQUEST_REQUEST_ID]);
			$decide_type = mysql_real_escape_string($_POST[$ACTION_TYPE_REQUEST_TYPE]);
			//if($user_id>0 || $request_id>0){
			if($decide_type==$ACTION_TYPE_REQUEST_YES || $decide_type==$ACTION_TYPE_REQUEST_NO){
				$query = 'select shift_id,request_user_id,fulfill_user_id,approved_user_id,status from requests where id="'.$request_id.'" limit 1;';
				$result = mysql_query($query);
				if($result && mysql_num_rows($result)==1){
					$row = mysql_fetch_assoc($result);
					$shift_id = intval($row["shift_id"]);
					$request_status = intval($row["status"]);
					$request_user_id = intval($row["request_user_id"]);
					$fulfill_user_id = intval($row["fulfill_user_id"]);
					mysql_free_result($result);
					if($request_status==0){
						if($decide_type==$ACTION_TYPE_REQUEST_NO){ ////////////////////////////////////////////////////////////////////////////////////////////
							$query = 'update requests set approved_user_id="'.$user_id.'", approved_date=now(), status="3" where id="'.$request_id.'";';
							$result = mysql_query($query);
							if($result){
								mysql_free_result($result);
								echo '{ "status": "success", "message": "request denied" }';
							}else{
								echo '{ "status": "error", "message": "bad no update" }';
							}
						}else if($decide_type==$ACTION_TYPE_REQUEST_YES){
							if($fulfill_user_id>0){
								$query = 'update shifts set user_id="'.$fulfill_user_id.'" where id="'.$shift_id.'";';
								$result = mysql_query($query);
								if($result){
									mysql_free_result($result);
									$query = 'update requests set approved_user_id="'.$user_id.'", approved_date=now(), status="2" where id="'.$request_id.'";';
									$result = mysql_query($query);
									if($result){
										mysql_free_result($result);
										echo '{ "status": "success", "message": "request approved" }';
									}else{
										echo '{ "status": "error", "message": "bad yes update" }';
									}
								}else{
									echo '{ "status": "error", "message": "shift update fail" }';
								}
							}else{
								echo '{ "status": "error", "message": "cannot approve without fill-in" }';
							}
						}
					}else{
						echo '{ "status": "error", "message": "request closed" }';
					}
				}else{
					echo '{ "status": "error", "message": "request does not exist" }';
				}
			}else{
				echo '{ "status": "error", "message": "unknown type" }';
			}
		}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_SHIFT_LIST){
			$query = 'select S.id, S.created, S.user_id, S.time_begin, S.time_end, S.algorithm, S.position_id, S.position_name, users.username as username '
			.'from (select shifts.id as id, shifts.created as created, shifts.user_id as user_id, shifts.time_begin as time_begin, shifts.time_end as time_end, shifts.algorithm as algorithm, positions.id as position_id, positions.name as position_name '
				.'from shifts left outer join positions on shifts.position_id=positions.id where shifts.parent_id=0 order by shifts.id asc) as S '
				.'left outer join users on S.user_id=users.id;';
			$result = mysql_query($query);
			if($result){
				$total = mysql_num_rows($result);
				$i = 0;
				echo '{ "status": "success", "message": "list", "total":"'.$total.'", "list": ['."\n";
				while($row = mysql_fetch_assoc($result)){
					$shift_id = $row["id"];
					$created = $row["created"];
					$user_id = $row["user_id"];
					$username = $row["username"];
					$time_begin = $row["time_begin"];
					$time_end = $row["time_end"];
					$algorithm = $row["algorithm"];
					$position_id = $row["position_id"];
					$position_name = $row["position_name"];
					echo '{ "id":"'.$shift_id.'", "created": "'.$created.'", "user_id": "'.$user_id.'", "username":"'.$username.'", "time_begin": "'.$time_begin.'", "time_end": "'.$time_end.'", ';
					echo ' "algorithm":"'.$algorithm.'", "position_id":"'.$position_id.'", "position_name":"'.$position_name.'", "created": "'.$created.'" }';
					$i += 1;
					if($i<$total){
						echo ',';
					}
					echo "\n";
				}
				echo '] }';
			}else{
				echo '{ "status": "error", "message": "bad search" }';
			}
		}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_SHIFT_INFO){
			$shift_id = mysql_real_escape_string($_POST[$ACTION_TYPE_SHIFT_INFO_ID]);
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
					mysql_free_result($result);
					// sub-query - open request
					$request_id = 0;
					$request_filled = "false";
					$query = 'select id,fulfill_user_id from requests where shift_id="'.$shift_id.'" and status="0" ;'; // open request
					$result = mysql_query($query, $connection);
					if($result){
						$count = mysql_num_rows($result);
						if($count>=1){
							$row = mysql_fetch_assoc($result);
							$request_id = $row["id"];
							$fulfill_user_id = intval($row["fulfill_user_id"]);
							if($fulfill_user_id>0){
								$request_filled = "true";
							}
						}
						mysql_free_result($result);
					}
					echo '{ "status": "success", "message": "shift", "shift": {'."\n";
					echo '"id": "'.$shift_id.'", "user_id": "'.$user_id.'", "username": "'.$username.'", "created": "'.$created.'", "position_id": "'.$position_id.'", "position_name": "'.$position_name.'", ';
					echo '"time_begin": "'.$time_begin.'", "time_end": "'.$time_end.'", "algorithm": "'.$algorithm.'", "request_id": "'.$request_id.'", "request_filled": '.$request_filled.', "parent_id": "'.$parent_id.'", '."\n";
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
							mysql_free_result($result);
							echo '"parent": { ';
							echo '"id": "'.$shift_id.'", "user_id": "'.$user_id.'", "username": "'.$username.'", "created": "'.$created.'", "position_id": "'.$position_id.'", "position_name": "'.$position_name.'", "time_begin": "'.$time_begin.'", "time_end": "'.$time_end.'", "algorithm": "'.$algorithm.'", "parent_id": "'.$parent_id.'" '."\n";
							echo ' }'."\n";
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
		}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_SHIFT_UPDATE_USER_SINGLE || $ARGUMENT_GET_ACTION==$ACTION_TYPE_SHIFT_UPDATE_USER_EMPTY || $ARGUMENT_GET_ACTION==$ACTION_TYPE_SHIFT_UPDATE_USER_ALL || $ARGUMENT_GET_ACTION==$ACTION_TYPE_SHIFT_UPDATE_USER_FUTURE){
				$shift_id = mysql_real_escape_string($_POST[$ACTION_TYPE_SHIFT_UPDATE_SHIFT_ID]);
				$was_shift_id = $shift_id;
				$user_id = mysql_real_escape_string($_POST[$ACTION_TYPE_SHIFT_UPDATE_USER_ID]);
				if($user_id<=0 || $shift_id<=0){
					echo '{ "status": "error", "message": "invalid id" }';
					return;
				}
				$query = 'select id,parent_id,time_begin from shifts where id="'.$shift_id.'"; '; // get parent
				$result = mysql_query($query, $connection);
				if($result && mysql_num_rows($result)==1 ){
					$row = mysql_fetch_assoc($result);
					$parent_id = $row["parent_id"];
					$time_begin = $row["time_begin"];
					mysql_free_result($result);
					if($ARGUMENT_GET_ACTION==$ACTION_TYPE_SHIFT_UPDATE_USER_SINGLE){ // expect child
						if($parent_id==0){
							echo '{ "status": "error", "message": "cannot apply to parent shift" }';
						}else{
							$query = 'select id, user_id from shifts where id="'.$shift_id.'"; ';
							$result = mysql_query($query, $connection);
							if($result && mysql_num_rows($result)==1){
								$row = mysql_fetch_assoc($result);
								$old_user_id = $row["user_id"];
								mysql_free_result($result);
								if($old_user_id!=$user_id){
									$query = 'update shifts set user_id="'.$user_id.'" where id="'.$shift_id.'"; ';
									$result = mysql_query($query, $connection);
									if($result){
										echo '{ "status": "success", "message": "single shift updated", "shift": { "id":"'.$shift_id.'", "time_begin": "'.$time_begin.'" } }';
									}else{
										echo '{ "status": "error", "message": "update failed" }';
									}
								}else{
									echo '{ "status": "error", "message": "user already assigned" }';
								}
							}else{
								echo '{ "status": "error", "message": "unknown" }';
							}
						}
					}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_SHIFT_UPDATE_USER_EMPTY || $ARGUMENT_GET_ACTION==$ACTION_TYPE_SHIFT_UPDATE_USER_ALL || $ARGUMENT_GET_ACTION==$ACTION_TYPE_SHIFT_UPDATE_USER_FUTURE){ // expect parent
						$old_time_begin = $time_begin; $old_shift_id = $shift_id;
						if($parent_id!=0){ // get parent info
							$shift_id = $parent_id;
							$query = 'select time_begin from shifts where id="'.$shift_id.'"; ';
							$result = mysql_query($query, $connection);
							if($result && mysql_num_rows($result)==1){
								$row = mysql_fetch_assoc($result);
								$time_begin = $row["time_begin"];
								mysql_free_result($result);
							}else{ return; }
						}
						if($ARGUMENT_GET_ACTION==$ACTION_TYPE_SHIFT_UPDATE_USER_EMPTY){
							$query = 'update shifts set user_id="'.$user_id.'" where parent_id="'.$parent_id.'" and user_id="0";';
							$message = 'empty shifts updated';
						}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_SHIFT_UPDATE_USER_ALL){
							$query = 'update shifts set user_id="'.$user_id.'" where parent_id="'.$parent_id.'";';
							$message = 'all shifts updated';
						}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_SHIFT_UPDATE_USER_FUTURE){
							//$query = 'update shifts set user_id="'.$user_id.'" where parent_id="'.$parent_id.'" and time_begin>now();'; // future = NOW
							$query = 'update shifts set user_id="'.$user_id.'" where parent_id="'.$parent_id.'" and time_begin>=(select time_begin from (select time_begin from shifts where id="'.$was_shift_id.'") as S);'; // future = NEXT SHIFTS
							$message = 'future shifts updated';
							$shift_id = $old_shift_id;
							$time_begin = $old_time_begin;
						}
						$result = mysql_query($query, $connection);
						if($result){
							echo '{ "status": "success", "message": "'.$message.'", "shift": { "id":"'.$shift_id.'", "time_begin": "'.$time_begin.'" } }';
						}else{
							echo '{ "status": "error", "message": "update failed" }';
						}
					}
					
				}else{
					echo '{ "status": "error", "message": "unknown shift" }';
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
			}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_SHIFT_DELETE_SHIFT){
				$shift_id = decode_real_escape_string($_POST[$ACTION_TYPE_SHIFT_DELETE_SHIFT_ID]);
				$query = 'select * from shifts where id="'.$shift_id.'";';
				$result = mysql_query($query);
				if($result && mysql_num_rows($result)==1){
					$row = mysql_fetch_row($result);
					$parent_id = intval($row["parent_id"]);
					mysql_free_result($result);
					if($parent_id==0){
						$query = 'delete from requests where shift_id in (select id from shifts where parent_id="'.$shift_id.'") or shift_id="'.$shift_id.'";';
						$result = mysql_query($query);
						if($result){
							$query = 'delete from shifts where parent_id="'.$shift_id.'";';
							$result = mysql_query($query);
							if($result){
								mysql_free_result($result);
								$query = 'delete from shifts where id="'.$shift_id.'";';
								$result = mysql_query($query);
								if($result){
									mysql_free_result($result);
									echo '{ "status": "success", "message": "deleted shift successfully" }';
								}else{
									echo '{ "status": "error", "message": "could not delete source entry" }';
								}
							}else{
								echo '{ "status": "error", "message": "could not delete children entries" }';
							}
						}else{
							echo '{ "status": "error", "message": "cannot delete sub-shift" }';
						}
					}else{
						echo '{ "status": "error", "message": "cannot delete related requests" }';
					}
				}else{
					echo '{ "status": "error", "message": "invalid shift" }'; // '.mysql_real_escape_string($query).'
				}
			}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_CALENDAR){
				$calOption = mysql_real_escape_string($_POST[$ACTION_TYPE_CALENDAR_OPTION]);
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
				if($calOption==$ACTION_TYPE_CALENDAR_OPTION_SELF && $ACTION_VALUE_USER_ID>0){
					$calOption = ' and shifts.user_id="'.$ACTION_VALUE_USER_ID.'" ';
				}else{
					$calOption = '';
				}
				$query = 'select S.id, S.parent_id, S.user_id, S.time_begin, S.time_end, S.position_id, S.username, positions.name as position_name from'
					.' (select shifts.id,shifts.parent_id,shifts.user_id,shifts.time_begin,shifts.time_end,shifts.position_id,users.username from shifts'
					.' left outer join users on shifts.user_id=users.id    where parent_id!=0 '.$calOption.' and shifts.time_begin between "'.$startDate.'" and "'.$endDate.'" order by time_begin asc) as S '
					.' left outer join positions on S.position_id=positions.id;';
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
						$begin = $row["time_begin"];
						$end  = $row["time_end"];
						$position_id = $row["position_id"];
						$position_name = $row["position_name"];
						$shift_id = $row["id"];
							$request_open_exists = "false";
							$request_fillin_exists = "false";
							$fulfill_user_id = 0;
							$subquery = 'select status,fulfill_user_id from requests where shift_id="'.$shift_id.'" and status="0" order by status asc limit 1;'; // open requests
							$subresult = mysql_query($subquery, $connection);
							if($subresult){
								if(mysql_num_rows($subresult)==1){
									$request_open_exists = "true";
									$subrow = mysql_fetch_assoc($subresult);
									$fulfill_user_id = intval($subrow["fulfill_user_id"]);
									if($fulfill_user_id!=0){
										$request_fillin_exists = "true";
									}
								}
								mysql_free_result($subresult);
							}
						echo '{ "begin": "'.$begin.'", "end": "'.$end.'", "parent": "'.$parent_id.'", "user_id": "'.$user_id.'", "username": "'.$username.'", ';
						echo ' "position_id" : "'.$position_id.'", "position_name": "'.$position_name.'", "id" : "'.$shift_id.'", ';
						echo ' "request_open_exists": "'.$request_open_exists.'", "fulfill_user_id": "'.$fulfill_user_id.'" }';
						if( $i<($total_results-1) ){ echo ','; }
						echo "\n";
						//echo $i." ".($total_results-1)." ".($i<($total_results-1))."\n";
						++$i;
					}
					echo ']'."\n";
					mysql_free_result($result);
				}else{
					echo '"total": 0, "list": []';
				}
				echo ' }';
			}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_POSITION_READ){
				$query = 'select positions.id,positions.created_user_id,positions.created,positions.modified,positions.modified_user_id,positions.name,positions.info, '
				.'usersA.username as created_username, usersB.username as modified_username from positions '
				.'left outer join (users as usersA) on positions.created_user_id=usersA.id '
				.'left outer join (users as usersB) on positions.modified_user_id=usersB.id '
				.'order by created asc, id asc ;';
				$result = mysql_query($query, $connection);
				if($result){
					$total_results = mysql_num_rows($result);
					$i = 0;
					echo '{ "status": "success", "message": "positions", "total": '.$total_results.', "list" : ['."\n";
					while($row = mysql_fetch_assoc($result)){
						$position_id = $row["id"];
						$name = $row["name"];
						$desc = $row["info"];
						$created = $row["created"];
						$created_user_id = $row["created_user_id"];
						$created_username = $row["created_username"];
						$modified = $row["modified"];
						$modified_username = $row["modified_username"];
						echo '{ "name": "'.$name.'", "description": "'.$desc.'", "id": "'.$position_id.'", "created": "'.$created.'", "created_user_id": "'.$created_user_id.'", ';
						echo '"modified": "'.$modified.'", "modified_user_id": "'.$modified_user_id.'", ';
						echo '"created_username": "'.$created_username.'", "modified_username": "'.$modified_username.'" }';
						if($i<($total_results-1)){ echo ','; }
						echo "\n";
						++$i;
					}
					echo '] }';
					mysql_free_result($result);
				}else{
					echo '{ "status": "success", "message": "empty", "total": 0, "list" : [] }';
				}
			}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_POSITION_SINGLE_READ){
				$position_id = mysql_real_escape_string($_POST[$ACTION_TYPE_POSITION_SINGLE_ID]);
				if($position_id && $position_id>0){
					$query = 'select positions.id,positions.created,positions.created_user_id,positions.modified,positions.modified_user_id,positions.name,positions.info '
					.'from positions where id="'.$position_id.'";';
					// outer join
					$result = mysql_query($query, $connection);
					if($result){
						$total_results = mysql_num_rows($result);
						if($total_results==1){
							$row = mysql_fetch_assoc($result);
							$position_id = $row["id"];
					 		$created = $row["created"];
					 		$created_user_id = $row["created_user_id"];
					 		$modified = $row["modified"];
					 		$modified_user_id = $row["modified_user_id"];
					 		$name = $row["name"];
					 		$desc = $row["info"];
					 		echo '{ "status": "success", "message": "position found", "position" : {';
					 		echo '"id": "'.$position_id.'", "created": "'.$created.'", "modified": "'.$modified.'", ';
					 		echo '"created_user_id": "'.$created_user_id.'", "modified_user_id": "'.$modified_user_id.'", ';
					 		echo '"name": "'.$name.'", "description": "'.$desc.'" } }';
						}else{
							echo '{ "status": "error", "message": "no results" }';
						}
						mysql_free_result($result);
					}else{
						echo '{ "status": "error", "message": "bad search" }';
					}
				}
			}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_POSITION_SINGLE_CREATE){
				$position_name = decode_real_escape_string($_POST[$ACTION_TYPE_POSITION_SINGLE_NAME]);
				$position_info = decode_real_escape_string($_POST[$ACTION_TYPE_POSITION_SINGLE_INFO]);
				$user_id = $ACTION_VALUE_USER_ID;
				if( isValidPositionData($position_name,$position_info) ){
					$query = 'insert into positions (created_user_id, created, modified_user_id, modified, name, info) values ("'
					.$user_id.'",now(),"0",now(),"'.$position_name.'","'.$position_info.'");';
					$result = mysql_query($query, $connection);
					if($result){
						$position_id = intval( mysql_insert_id() );
						mysql_free_result($result);
						echo '{ "status": "success", "message": "create success", "position": {"id": "'.$position_id.'"} }';
					}else{
						echo '{ "status": "error", "message": "create error" }';
					}
				}else{
					echo '{ "status": "error", "message": "invalid parameters" }';
				}
			}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_POSITION_SINGLE_UPDATE){
				$position_id = mysql_real_escape_string($_POST[$ACTION_TYPE_POSITION_SINGLE_ID]);
				$position_name = decode_real_escape_string($_POST[$ACTION_TYPE_POSITION_SINGLE_NAME]);
				$position_info = decode_real_escape_string($_POST[$ACTION_TYPE_POSITION_SINGLE_INFO]);
				$user_id = $ACTION_VALUE_USER_ID;
				if( isValidPositionData($position_name,$position_info) ){
					$query = 'update positions set name="'.$position_name.'", info="'.$position_info.'", modified_user_id="'.$user_id.'", modified=now() where id="'.$position_id.'";';
					$result = mysql_query($query, $connection);
					if($result){
						mysql_free_result($result);
						echo '{ "status": "success", "message": "update success", "position": {"id": "'.$position_id.'"} }';
					}else{
						echo '{ "status": "error", "message": "update error" }';
					}
				}else{
					echo '{ "status": "error", "message": "invalid parameters" }';
				}
			}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_POSITION_SINGLE_DELETE){
				$position_id = mysql_real_escape_string($_POST[$ACTION_TYPE_POSITION_SINGLE_ID]);
				$query = 'select id from positions where id="'.$position_id.'";';
				$result = mysql_query($query, $connection);
				if($result && mysql_num_rows($result)==1){
					mysql_free_result($result);
					// ALSO NEED TO UPDATE/DELETE POSSIBLY EXISTING REQUESTS
					$query = 'delete from requests where shift_id in (select id from shifts where id in (select id from shifts where position_id="'.$position_id.'"));';
					$result = mysql_query($query, $connection);
					if($result){
						$total_requests = mysql_affected_rows();
						mysql_free_result($result);
						// ALSO NEED TO UPDATE/DELETE POSSIBLY EXISTING SHIFTS
						$total_parent = 0;
						$total_children = 0;
						$query = 'delete from shifts where position_id="'.$position_id.'" and parent_id="0";';
						$result = mysql_query($query, $connection);
						if($result){
							$total_parent = mysql_affected_rows();
							mysql_free_result($result);
						}
						$query = 'delete from shifts where position_id="'.$position_id.'";';
						$result = mysql_query($query, $connection);
						if($result){
							$total_children = mysql_affected_rows();
							mysql_free_result($result);
						}
						$query = 'delete from positions where id="'.$position_id.'" limit 1;';
						$result = mysql_query($query, $connection);
						if($result){
							echo '{ "status": "success", "message": "delete successful", "position": {"id": "'.$position_id.'"}, "total_parent": "'.$total_parent.'", "total_children": "'.$total_children.'" }';
						}else{
							echo '{ "status": "error", "message": "could not delete position" }';
						}
					}else{
						echo '{ "status": "error", "message": "could not delete relates requests" }';
					}
				}else{
					echo '{ "status": "error", "message": "position does not exist" }';
				}
			}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_GROUP_GET){
				$query = 'select id, name, info from groups;';
				$result = mysql_query($query, $connection);
				if($result){
					$total_results = mysql_num_rows($result);
					$i = 0;
					echo '{ "status": "success", "message": "groups", "total": '.$total_results.', "list" : ['."\n";
					while($row = mysql_fetch_assoc($result)){
						$id = $row["id"];
						$name = $row["name"];
						$info = $row["info"];
						echo '{ "id": "'.$id.'", "name": "'.$name.'", "info": "'.$info.'" }';
						if($i<($total_results-1)){ echo ','; }
						echo "\n";
						++$i;
					}
					echo '] }';
					mysql_free_result($result);
				}else{
					echo '{ "status": "error", "message": "bad search" }';
				}
			
			}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_USER_CREATE || $ARGUMENT_GET_ACTION==$ACTION_TYPE_USER_UPDATE){
				$isUpdate=($ARGUMENT_GET_ACTION==$ACTION_TYPE_USER_UPDATE);
				$user_id = decode_real_escape_string($_POST[$ACTION_TYPE_USER_USER_ID]);
				$username = decode_real_escape_string($_POST[$ACTION_TYPE_USER_USERNAME]);
				$first_name = decode_real_escape_string($_POST[$ACTION_TYPE_USER_FIRST_NAME]);
				$last_name = decode_real_escape_string($_POST[$ACTION_TYPE_USER_LAST_NAME]);
				$email = decode_real_escape_string($_POST[$ACTION_TYPE_USER_EMAIL]);
				$phone = decode_real_escape_string($_POST[$ACTION_TYPE_USER_PHONE]);
					$phone = getPhoneAsNumbers($phone);
				$address = decode_real_escape_string($_POST[$ACTION_TYPE_USER_ADDRESS]);
				$city = decode_real_escape_string($_POST[$ACTION_TYPE_USER_CITY]);
				$state = decode_real_escape_string($_POST[$ACTION_TYPE_USER_STATE]);
				$zip = decode_real_escape_string($_POST[$ACTION_TYPE_USER_ZIP]);
				$group_id = decode_real_escape_string($_POST[$ACTION_TYPE_USER_GROUP_ID]);
				$admin_password = strtoupper(decode_real_escape_string($_POST[$ACTION_TYPE_USER_ADMIN_PASSWORD]));
				$new_password = strtoupper(decode_real_escape_string($_POST[$ACTION_TYPE_USER_NEW_PASSWORD]));
				$confirm_password = strtoupper(decode_real_escape_string($_POST[$ACTION_TYPE_USER_CONFIRM_PASSWORD]));
				//
				if($isUpdate){
					$isValid = isValidUserData($username,$first_name,$last_name,$email,$phone,$address,$city,$state,$zip,$group_id,$admin_password,$new_password,$confirm_password,true);
					$isSameUser = $user_id==$ACTION_VALUE_USER_ID;
					if($isSameUser||$ACTION_VALUE_IS_ADMIN){ // can insert if the same as logged-in user or if admin
						$query = 'select password from users where id=(select user_id from sessions where session_id="'.$ACTION_VALUE_SESSION_ID.'");';
						$result = mysql_query($query,$connection);
						if($result){
							$total_results = mysql_num_rows($result);
							if($total_results==1){
								$row = mysql_fetch_assoc($result);
								$password = $row["password"];
								mysql_free_result($result);
								if($password==$admin_password){
									if($new_password==$confirm_password){
										$pw = '';
										if($new_password!=""){ // changed pw
											$pw = 'password="'.$new_password.'",';
										}
										$query = 'update users set '.$pw.' email="'.$email.'", first_name="'.$first_name.'", last_name="'.$last_name.'", phone="'.$phone.'", '.
											'address="'.$address.'", state="'.$state.'", city="'.$city.'", zip="'.$zip.'", group_id="'.$group_id.'", modified=now(), modified_user_id="'.$ACTION_VALUE_USER_ID.'" '.
											'where id="'.$user_id.'";';
										$result = mysql_query($query,$connection);
										if($result){
											echo '{ "status": "success", "message": "user updated", "user": {"id":"'.$user_id.'"} }';
										}else{
											echo '{ "status": "error", "message": "could not update user" }'; // '.mysql_real_escape_string($query).'
										}
									}else{
										echo '{ "status": "error", "message": "new and confirm passwords do not match" }';
									}
								}else{
									echo '{ "status": "error", "message": "incorrect password" }';
								}
							}else{
								echo '{ "status": "error", "message": "invalid user" }';
							}
						}else{
							echo '{ "status": "error", "message": "bad search" }';
						}
					}else{
						echo '{ "status": "error", "message": "permissions" }';
					}
				}else if($ACTION_VALUE_IS_ADMIN){
					$isValid = isValidUserData($username,$first_name,$last_name,$email,$phone,$address,$city,$state,$zip,$group_id,$admin_password,$new_password,$confirm_password);
					if($isValid=="success"){
						$query = 'select id from users where username="'.$username.'";';
						$result = mysql_query($query,$connection);
						if($result){
							$total_results = mysql_num_rows($result);
							mysql_free_result($result);
							if($total_results==0){
								$query = 'select password from users where id=(select user_id from sessions where session_id="'.$ACTION_VALUE_SESSION_ID.'");';
								$result = mysql_query($query,$connection);
								if($result){
									$total_results = mysql_num_rows($result);
									if($total_results==1){
										$row = mysql_fetch_assoc($result);
										$password = $row["password"];
										mysql_free_result($result);
										if($password==$admin_password){
											$query = 'insert into users (username, password, email, first_name, last_name, phone, address, state, city, zip, group_id, created, modified, created_user_id, modified_user_id) '.
											'values ("'.$username.'","'.$new_password.'","'.$email.'", "'.$first_name.'", "'.$last_name.'","'.$phone.'", "'.$address.'", "'
											.$state.'", "'.$city.'", "'.$zip.'", "'.$group_id.'", now(), now(), "'.$ACTION_VALUE_USER_ID.'", "'.$ACTION_VALUE_USER_ID.'");';
											$result = mysql_query($query,$connection);
											if($result){
												$user_id = intval( mysql_insert_id() );
												echo '{ "status": "success", "message": "user created", "user": {"id":"'.$user_id.'"} }';
											}else{
												echo '{ "status": "error", "message": "could not create user" }';
											}
										}else{
											echo '{ "status": "error", "message": "incorrect admin password" }';
										}
									}else{
										echo '{ "status": "error", "message": "invalid user" }';
									}
								}else{
									echo '{ "status": "error", "message": "bad search" }';
								}
							}else{
								echo '{ "status": "error", "message": "username already exists" }';
							}
						}else{
							echo '{ "status": "error", "message": "username error" }';
						}
					}else{
						echo '{ "status": "error", "message": "'.$isValid.'" }';
					}
				}else{
					echo '{ "status": "error", "message": "permissions" }';
				}
			}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_USER_DELETE){
				if($ACTION_VALUE_IS_ADMIN){
					$user_id = decode_real_escape_string($_POST[$ACTION_TYPE_USER_USER_ID]);
					if($user_id!=$ACTION_VALUE_USER_ID){
						$query = 'select username from users where id="'.$user_id.'";';
						$result = mysql_query($query,$connection);
						if($result && mysql_num_rows($result)==1){
							mysql_free_result($result);
							$query = 'select name from groups where id=(select group_id from users where id="'.$user_id.'");';
							$result = mysql_query($query,$connection);
							if($result && mysql_num_rows($result)==1){
								$row = mysql_fetch_assoc($result);
								$group_name = $row["group"];
								$userIsAdmin = false;
								if( $group_name=="admin" ){
									$userIsAdmin = true;
								}
								mysql_free_result($result);
								$query='select count(*) as count from users where group_id=(select id from groups where name like "admin");';
								$result = mysql_query($query,$connection);
								if($result && mysql_num_rows($result)==1){
									$count = intval( $row["count"] );
									mysql_free_result($result);
									if( !($count<=1 && $userIsAdmin) ){ // at least 1 admin users must exist if deleted user is an admin
										// log em out
										$query = 'delete from sessions where user_id="'.$user_id.'";';
										$result = mysql_query($query,$connection);
										mysql_free_result($result);
										// close requests filled by em
										$query = 'update requests set status="3" where status<=1 and fulfill_user_id="'.$user_id.'";';
										$result = mysql_query($query,$connection);
										mysql_free_result($result); 
										// unassign shifts from em
										$query = 'update shifts set user_id="0" where user_id="'.$user_id.'";';
										$result = mysql_query($query,$connection);
										mysql_free_result($result); 
										// delete em
										$query = 'delete from users where id="'.$user_id.'";';
										$result = mysql_query($query,$connection);
										if($result){
											echo '{ "status": "success", "message": "user deleted", "user": {"id":"'.$user_id.'"} }';
										}else{
											echo '{ "status": "error", "message": "could not delete user" }';
										}
										// shots
									}else{
										echo '{ "status": "error", "message": "at least 1 admin must exist" }';
									}
								}else{
									echo '{ "status": "error", "message": "bad count" }';
								}
							}else{
								echo '{ "status": "error", "message": "bad group search" }';
							}
						}else{
							echo '{ "status": "error", "message": "user does not exist '.$user_id.'" }';
						}
					}else{
						echo '{ "status": "error", "message": "cannot delete self" }';
					}
				}else{
					echo '{ "status": "error", "message": "permissions" }';
				}
			}else if($ARGUMENT_GET_ACTION=="MOAR_USER_PARAMS"){
				echo '{ "status": "error", "message": "?" }';
			// PURELY ADMIN -------------------------------------------------------------------			
			}else if($ACTION_VALUE_IS_ADMIN){
				//
			}
		}
	mysql_close($connection);
}else{

// ...

include "header.php";
includeHeader("carpe diem"); // provehito in altum  |  carpe diem


includeBody();

// TEST EMAIL

// output = htmlentities(input)
// out = urldecode(in)

includeFooter();
}
?>
