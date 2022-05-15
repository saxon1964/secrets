<?php

require_once('core/include.php');
require_once('authCheck.php');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

checkRequestMethod('POST');
$token = getAuthToken();

$status = 1;
if($token != null && isset($_POST['secret'])) {
  $token_sql = addslashes($token);
  $secret_sql = addslashes($_POST['secret']);
  $userid = get_single_value("SELECT userid FROM sessions WHERE token='$token_sql' AND status=1");
  $status = query("INSERT INTO secrets (userid, secret) VALUES ($userid, '$secret_sql')");
}

echo(json_encode(array('status' => $status)));
