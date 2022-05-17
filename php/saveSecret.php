<?php

require_once('core/include.php');
require_once('authCheck.php');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

checkRequestMethod('POST');
$token = getAuthToken();

$status = 1;
if($token != null && isset($_POST['id']) && isset($_POST['secret'])) {
  $token_sql = addslashes($token);
  $id = (int) $_POST['id'];
  $secret_sql = addslashes($_POST['secret']);
  $userid = get_single_value("SELECT userid FROM sessions WHERE token='$token_sql' AND status=1");
  if($id == 0) {
    $status = query("INSERT INTO secrets (userid, secret) VALUES ($userid, '$secret_sql')");
  }
  else {
    $count = query("UPDATE secrets SET secret='$secret_sql' WHERE id=$id AND userid=$userid");
    $status = ($count == 1)? 0: 2;
  }
}

echo(json_encode(array('status' => $status)));
