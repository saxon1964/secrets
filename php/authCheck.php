<?php

require_once('core/include.php');

define("AUTH_HEADER_NAME", 'Authorization');
define("HEADERS_ALLOWED", AUTH_HEADER_NAME . ',Content-type');
define("AUTH_HEADER_VALUE_PREFIX", 'Bearer: ');

header('Access-Control-Allow-Headers: ' . HEADERS_ALLOWED);

function getAuthToken()
{
    global $CFG;
    $headers = getallheaders();
    if (!array_key_exists(AUTH_HEADER_NAME, $headers)) {
        return null;
    }
    $header = $headers[AUTH_HEADER_NAME];
    if (strpos($header, AUTH_HEADER_VALUE_PREFIX) !== 0) {
        return null;
    }
    $token = substr($header, strlen(AUTH_HEADER_VALUE_PREFIX));
    $token_sql = addslashes(hash($CFG['HASH_ALG'], $token));
    $query = "SELECT token FROM sessions WHERE token='$token_sql' AND status=1 LIMIT 1";
    $t = get_single_value($query);
    return $t;
}

function checkAuthToken()
{
    $token = getAuthToken();
    if ($token == null) {
        $result = array("authCheck" => false);
        echo(json_encode($result));
        exit(-1);
    }
}

function checkRequestMethod($method)
{
    if ($_SERVER['REQUEST_METHOD'] !== $method) {
        $result = array("authCheck" => 35);
        echo(json_encode($result));
        exit(-1);
    }
}
