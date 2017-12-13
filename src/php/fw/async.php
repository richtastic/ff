<?php
// async.php

// http://www.phpjobscheduler.co.uk/
// http://stackoverflow.com/questions/13846192/php-threading-call-to-a-php-function-asynchronously
//pecl install pthreads

// http://php.net/manual/en/class.thread.php
// class My extends Thread {
// 	public function run() {
// 		sleep(4);
//     	//$fxn();
// 	}
// }
// $my = new My();
// var_dump($my->start());

function async_fxn(){//(&$fxn, $seconds=1){
	error_log("async_fxn");
	//sleep($seconds);
	$cmd = "php exit";
	// $cmd .= " > /dev/null 2>&1 &";
	//exec($cmd, $output, $exit);
	run_in_background("echo `date` > /tmp/out.txt");
	error_log("out");
}


//error_log("async_fxnadsadss");

// http://php.net/manual/en/function.curl-multi-exec.php

// https://segment.com/blog/how-to-make-async-requests-in-php/




// http://stackoverflow.com/questions/222414/asynchronous-shell-exec-in-php
// http://php.net/manual/en/function.pcntl-fork.php
// http://stackoverflow.com/questions/209774/does-php-have-threading
// https://nsaunders.wordpress.com/2007/01/12/running-a-background-process-in-php/






// https://nsaunders.wordpress.com/2007/01/12/running-a-background-process-in-php/
function run_in_background($Command, $Priority = 0){
	if($Priority)
		$PID = shell_exec("nohup nice -n $Priority $Command 2> /dev/null & echo $!");
	else
		$PID = shell_exec("nohup $Command 2> /dev/null & echo $!");
	return($PID);
}

function is_process_running($PID){
	exec("ps $PID", $ProcessState);
	return(count($ProcessState) >= 2);
}
?>
