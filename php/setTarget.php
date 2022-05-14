<?php

require_once('core/include.php');
require_once('authCheck.php');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

checkRequestMethod('POST');
$token = getAuthToken();

$status = 1;
if($token != null && isset($_POST['target'])) {
  $token_sql = addslashes($token);
  $target_sql = addslashes($_POST['target']);
  $id = get_single_value("SELECT userid FROM sessions WHERE token='$token_sql' AND status=1");
  $count = query("UPDATE users SET target='$target_sql' WHERE id=$id AND active=1");
  $status = ($count == 1)? 0: 2;
}

echo(json_encode(array('status' => $status)));
