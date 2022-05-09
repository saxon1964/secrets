<?php

require_once('core/include.php');
require_once('authCheck.php');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

checkVueRequestMethod('POST');

$salt = $CFG['PASSWORD_SALT'];
$hash_alg = $CFG['HASH_ALG'];
$mail_subject = $CFG['SECRET_MAIL_SUBJECT'];
$mail_from = $CFG['SECRET_MAIL_FROM'];
$mail_body = $CFG['SECRET_MAIL_BODY'];

function echoStatus($status) {
  echo(json_encode(array('status' => $status)));
}

if (isset($_POST['email']) && isset($_POST['password'])) {
  $email = $_POST['email'];
  $email_sql = addslashes($email);
  $password = $_POST['password'];
  $password_hash = hash($hash_alg, $salt . $password);
  $password_hash_sql = addslashes($password_hash);
  if(get_single_row("SELECT * FROM users WHERE email='$email_sql' AND active=0")) {
    query("DELETE FROM users WHERE email='$email_sql'");
  }
  if(get_single_row("SELECT * FROM users WHERE email='$email_sql' AND active=1")) {
    echoStatus(1);
  }
  else {
    $activation = random_int(10000000, 99999999);
    query("INSERT INTO users (email, password, activation, active) VALUES ('$email_sql', '$password_hash_sql', $activation, 0)");
    $mailStatus = mail($email, $mail_subject, $mail_body . $activation, "From: $mail_from");
    echoStatus($mailStatus? 0: 2);
  }
}
else {
  echoStatus(-1);
}
