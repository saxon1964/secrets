<?php

require_once('core/include.php');
require_once('authCheck.php');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

checkAuthToken();
checkRequestMethod('POST');

$token = getAuthToken();
$token_sql = addslashes($token);
$result = 2;
if ($token != null) {
    $query = "UPDATE sessions SET status=0 WHERE token='$token_sql' AND status=1 LIMIT 1";
    $result = (query($query) == 1)? 0: 1;
    $dbg->dump("debug.txt");
}

echo(json_encode(array('status' => $result)));
