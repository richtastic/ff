<?php
// functions.php


function includeHeader($title='Title'){
	echo '
<html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<head>
	<title>'.$title.'</title>
	<link rel="stylesheet" type="text/css" href="./volunteer.css">
	<script type="text/javascript" src="../code/Code.js"></script>
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
function includeFooter(){
	echo '
</body>
</html>
	';
}

function doSomething($val='default'){
	echo "doSomething ".$val;
}

?>