<?php

require_once('core/include.php');
require_once('authCheck.php');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

checkRequestMethod('POST');
$token = getAuthToken();

$status = 1;
if($token != null && isset($_POST['id'])) {
  $token_sql = addslashes($token);
  $id = abs((int) $_POST['id']);
  $userid = get_single_value("SELECT userid FROM sessions WHERE token='$token_sql' AND status=1");
  $count = query("DELETE FROM secrets WHERE id=$id AND userid=$userid");
  if($count == 1) {
    query("DELETE FROM files WHERE secretid=$id");
  }
  $status = ($count == 1)? 0: 2;
}

echo(json_encode(array('status' => $status)));
