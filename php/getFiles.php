<?php

require_once('core/include.php');
require_once('authCheck.php');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

checkRequestMethod('GET');
$token = getAuthToken();

$files = array();
if($token != null && isset($_GET['id'])) {
  // check if the current user owns the main secret id
  $token_sql = addslashes($token);
  $user1 = get_single_value("SELECT userid FROM sessions WHERE token='$token_sql' AND status=1");
  $id = (int) $_GET['id'];
  $user2 = get_single_value("SELECT userid FROM secrets WHERE id=$id");
  if($user1 != null && $user1 == $user2) {
    $rows = query("SELECT * FROM files WHERE secretid=$id ORDER BY id");
    while($row = $rows->fetch_assoc()) {
      $files[] = $row;
    }
  }
}

echo(json_encode($files));
