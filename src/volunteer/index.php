<?php
// index.php
include "functions.php";
include "config.php";


if($ARGUMENT_GET_ACTION!=null){
/*
http://localhost/alice/ff/src/volunteer/index.php?a=5


?a=users&page=2&order=created
?a=user&key=username&value=richie
?a=shifts&page=3&start=20130701&end=20130801
?a=shift&key=userid&value=2&start=20130101&end=20140101


limit 30,40

*/
$connection = mysql_connect("localhost","richie","qwerty"); // or die("I can not connect to database".mysql_error()); 
mysql_select_db("volunteering");
//echo "we have action: ".$ARGUMENT_GET_ACTION."<br/>";

// GET TOTAL NUMBER OF ROWS IN USERS TABLE
$query = "select count(id) as count from users";
$result = mysql_query($query, $connection);
$row = mysql_fetch_assoc($result);
$total_rows = $row["count"];
mysql_free_result($result);

// GET PAGE OF RESULTS
$query = "select * from users limit 30;";
$result = mysql_query($query, $connection);

if($result){
	$row = null;
	$i = 0;
	$total_results = mysql_num_rows($result);
	$total_results_m1 = $total_results - 1;
	echo '{ "status": "success", "total": "'.$total_rows.'", "count":"'.$total_results.'", "data": [';
	while($row = mysql_fetch_assoc($result)){
		//echo "username: ".$row["username"]."<br />";
		echo '{ "username": "'.$row["username"].'" }';
		if($i<$total_results_m1){
			echo ',';
		}
		++$i;
	}
	echo '] }';
	mysql_free_result($result);
}else{
	echo '{ "status": "error", "message": "'.mysql_error().'" }';
}


mysql_close($connection);

}else{

// ...

//include "header.php";
includeHeader("Volunteering");


//mysql_select_db("");
//echo $connection;



// TEST EMAIL





// ...

includeFooter();
}
?>
