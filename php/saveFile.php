<?php

require_once('core/include.php');
require_once('authCheck.php');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

checkRequestMethod('POST');
$token = getAuthToken();

$status = 1;
if($token != null && isset($_POST['id']) && isset($_POST['file'])) {
  // check if the current user owns the main secret id
  $token_sql = addslashes($token);
  $user1 = get_single_value("SELECT userid FROM sessions WHERE token='$token_sql' AND status=1");
  $id = (int) $_POST['id'];
  $user2 = get_single_value("SELECT userid FROM secrets WHERE id=$id");
  //trigger_error("ID: $id", E_USER_ERROR);
  if($user1 != null && $user1 == $user2) {
    $file_sql = addslashes($_POST['file']);
    query("INSERT INTO files (secretid, file) VALUES ($id, '$file_sql')");
    $status = 0;
  }
}

echo(json_encode(array('status' => $status)));
