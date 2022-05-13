<?php

require_once('core/include.php');
require_once('authCheck.php');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

checkRequestMethod('GET');

$token = getAuthToken();
$target = '';
if($token != null) {
  $token_sql = addslashes($token);
  $target = get_single_value("SELECT users.target FROM users, sessions WHERE users.email=sessions.email AND sessions.token='$token_sql'");
}

echo(json_encode(array('target' => $target)));
