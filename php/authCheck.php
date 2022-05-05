<?php

require_once('core/include.php');

define("AUTH_HEADER_NAME", 'Authorization');
define("AUTH_HEADER_VALUE_PREFIX", 'Bearer: ');

header('Access-Control-Allow-Headers: ' . AUTH_HEADER_NAME);

function getVueAuthToken()
{
    $headers = getallheaders();
    if (!array_key_exists(AUTH_HEADER_NAME, $headers)) {
        return null;
    }
    $header = $headers[AUTH_HEADER_NAME];
    if (strpos($header, AUTH_HEADER_VALUE_PREFIX) !== 0) {
        return null;
    }
    $token = substr($header, strlen(AUTH_HEADER_VALUE_PREFIX));
    $token_sql = addslashes(md5($token));
    return get_single_value("SELECT cookie FROM sessions WHERE cookie='$token_sql' AND status=1 LIMIT 1");
}

function checkVueAuthToken()
{
    if (getVueAuthToken() == null) {
        $result = array("authCheck" => false);
        echo(json_encode($result));
        exit(-1);
    }
}

function checkVueRequestMethod($method)
{
    if ($_SERVER['REQUEST_METHOD'] !== $method) {
        $result = array("authCheck" => false);
        echo(json_encode($result));
        exit(-1);
    }
}
