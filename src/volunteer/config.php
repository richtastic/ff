<?php
// config.php
function configConnectToDatabaseOrDie(){
	$connection = mysql_connect("localhost","richie","qwerty") or die('{ "status": "error", "message": "connection failed" }'); mysql_select_db("volunteering");
	return $connection;
}
?>