<?php
// sendMail.php

include "functions.php";

$toEmail = "zirbsster@gmail.com";
$subject = "Hi Richie";
$body = "Hello there Richie!\n\n-BSFTH";
$didSend = sendEmailBSFTH($toEmail, $subject,$body);

echo "DID SEND: ".$didSend;

?>