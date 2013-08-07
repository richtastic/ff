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
$ACTION_TYPE_LOGIN = 'login';
$ACTION_TYPE_SHIFT_CREATE = 'shift_create';
$ACTION_TYPE_SHIFT_CREATE_START_DATE = 'start_date';
$ACTION_TYPE_SHIFT_CREATE_END_DATE = 'end_date';
$ACTION_TYPE_SHIFT_CREATE_REPEATING = 'repeat';
$ARGUMENT_GET_ACTION = $_GET['a'];
$ARGUMENT_POST_ACTION = $_POST['a'];

if($ARGUMENT_GET_ACTION!=null){
	$connection = mysql_connect("localhost","richie","qwerty") or die('{ "status": "error", "message": "connection failed" }'); 
	mysql_select_db("volunteering");
	if($ARGUMENT_GET_ACTION==$ACTION_TYPE_LOGIN){
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
	}else if($ARGUMENT_GET_ACTION==$ACTION_TYPE_SHIFT_CREATE){
		$startDate = mysql_real_escape_string($_POST[$ACTION_TYPE_SHIFT_CREATE_START_DATE]);
		$endDate = mysql_real_escape_string($_POST[$ACTION_TYPE_SHIFT_CREATE_END_DATE]);
		$repeating = mysql_real_escape_string($_POST[$ACTION_TYPE_SHIFT_CREATE_REPEATING]);
		$result = computeDatePermutations($startDate,$endDate,$repeating);
		if($result!=null){
			echo "yerp";
		}else{
			echo "narp";
		}
		//echo '{ "status": "success", "message": "create shift...", "start":"'.$startDate.'", "end":"'.$endDate.'", "repeat":"'.$repeating.'" }';
	}else if(false){
		echo '{ "status": "error", "message": "not implemented" }';
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
