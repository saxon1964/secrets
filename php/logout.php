<?php

require_once('core/include.php');
require_once('authCheck.php');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

checkAuthToken();
checkRequestMethod('POST');

$hash_alg = $CFG['HASH_ALG'];

$token = getAuthToken();
$token_sql = addslashes(hash($hash_alg, $token));
$result = 0;
if ($token != null) {
    $query = "UPDATE sessions SET status=0 WHERE cookie='$token_sql' AND status=1 LIMIT 1";
    $result = query($query);
}

echo(json_encode(array('status' => $result)));
