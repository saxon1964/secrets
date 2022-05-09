<?php

require_once('core/include.php');
require_once('authCheck.php');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

checkVueRequestMethod('POST');

function echoStatus($status) {
  echo(json_encode(array('status' => $status)));
}

if (isset($_POST['email']) && isset($_POST['activation'])) {
  $email = $_POST['email'];
  $email_sql = addslashes($email);
  $activation = (int) $_POST['activation'];
  $count = query("UPDATE users SET active=1 WHERE email='$email_sql' AND activation=$activation AND active=0");
  echoStatus($count == 1? 0: 1);
}
else {
  echoStatus(-1);
}
