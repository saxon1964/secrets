<?php

require_once('core/include.php');
require_once('authCheck.php');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

checkRequestMethod('POST');
$token = getAuthToken();

$status = 1;
if($token != null && isset($_POST['id']) && isset($_POST['fileId'])) {
  // check if the current user owns the file that is about to be deleted
  $token_sql = addslashes($token);
  $id = (int) $_POST['id'];
  $fileId = (int) $_POST['fileId'];
  $user1 = get_single_value("SELECT userid FROM sessions WHERE token='$token_sql' AND status=1");
  $user2 = get_single_value("SELECT userid FROM secrets, files WHERE secrets.id=files.secretid AND files.id=$fileId");
  if($user1 != null && $user1 == $user2) {
    query("DELETE FROM files WHERE files.id=$fileId");
    $status = 0;
  }
}

echo(json_encode(array('status' => $status)));
