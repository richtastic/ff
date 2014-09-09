<?php
// crossorigin.php ? source = 
ini_set('display_errors', 1);

$url = $_GET["source"];

if($url){
	//$command = "wget ".$url." 2>&1";
	$command = "/bin/bash -c \"wget 2>&1\"";
	$result = shell_exec($command);
	//$result = exec("".$command);
	echo $result;
}

/*
header('Content-Type: image/jpeg');

*/
?>