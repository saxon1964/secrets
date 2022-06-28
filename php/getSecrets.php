<?php

require_once('core/include.php');
require_once('authCheck.php');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

checkRequestMethod('GET');
$token = getAuthToken();

$secrets = array();
if($token != null) {
  $token_sql = addslashes($token);
  $userid = get_single_value("SELECT userid FROM sessions WHERE token='$token_sql' AND status=1");
  $rows = query("SELECT id, secret FROM secrets WHERE userid=$userid");
  while($r = $rows->fetch_assoc()) {
    $r['files'] = array();
    $secrets[] = $r;
  }
  $rows->free();
  // find all files
  $rows = query("SELECT id, secretid, file FROM files");
  while($r = $rows->fetch_assoc()) {
    foreach($secrets as &$secret) {
      if($r['secretid'] == $secret['id']) {
        $secret['files'][] = $r;
        break;
      }
    }
  }
  $rows->free();
}

echo(json_encode($secrets));
