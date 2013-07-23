<?php
// index.php
include "functions.php";
include "config.php";

// ...

//include "header.php";
includeHeader("Volunteering");

$connection = mysql_connect("localhost","richie","qwerty",""); // or die("I can not connect to database".mysql_error()); 
//mysql_select_db("");
//echo $connection;


mysql_close($connection);



// ...

includeFooter();
?>