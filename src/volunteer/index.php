<?php
// index.php

echo "...";

$connection = mysql_connect("localhost","richie","qwerty",""); // or die("I can not connect to database".mysql_error()); 
//mysql_select_db("");
echo $connection;


echo "END1";

mysql_close($connection);

echo "END2";

?>