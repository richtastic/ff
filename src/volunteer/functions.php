<?php
// functions.php



function includeHeader($title='Title'){
	echo '
<html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<head>
	<title>'.$title.'</title>
	<link rel="stylesheet" type="text/css" href="./volunteer.css">
	<script type="text/javascript" src="./classes/json3.min.js"></script>
	<script type="text/javascript" src="./classes/Code.js"></script>
	<script type="text/javascript" src="./classes/Ajax.js"></script>
	<script type="text/javascript" src="./Volunteer.js"></script>
	<script>
	handlePageLoadedFunction = function(e){
		var vol = new Volunteer();
	}
	</script>
</head>
<body onload="handlePageLoadedFunction();">
	';
}
function includeBody(){
	echo '
	<div>
		<div id="login">
			<input type="text" name="login_username" />
			<input type="password" name="login_password" />
			<input type="submit" name="login_submit" value="Log In" />
		</div>
		<div id="logout">
			<input type="submit" name="logout_submit" value="Log Out" />
		</div>
		<div id="content">
			<div id="section_calendar"></div>
			<div id="section_profile"></div>
			<div id="section_crud_user"></div>
			<div id="section_crud_shift"></div>
			<div id="section_crud_"></div>
			<div id="section_"></div>
			<div id=""></div>
		</div>
	</div>
	';
}
function includeFooter(){
	echo '
</body>
</html>
	';
}

function randomSessionID(){
	return randomHex(64);
}

function randomHex($val=8){
	$str = "";
	for($i=0;$i<$val;++$i){
		$str = $str.strtoupper(base_convert(rand(0,15), 10, 16));
	}
	return $str;
}


function doSomething($val='default'){
	echo "doSomething ".$val;
}

?>