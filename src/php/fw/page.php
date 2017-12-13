<?php
// page.php

function create_page(){
$content = <<<CONTENT
<html>
	<head>
		<title>Follow The Leader</title>
		<link rel="stylesheet" href="css/theme.css">
	</head>
	<body>
	<header></header>
	<h1>Website</h1>
	<h3>follow the leader</h3>
	<div>
		And swallow your pride and drown.
	</div>
	<footer></footer>
	</body>
</html>
CONTENT;
return $content;
}



?>
