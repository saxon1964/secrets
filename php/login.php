<?php

require_once('core/include.php');
require_once('authCheck.php');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

checkVueRequestMethod('POST');

$data = array('token' => '', 'username' => '');

if (isset($_POST['username']) && isset($_POST['password'])) {
    $username = $_POST['username'];
    $username_sql = addslashes($username);
    $password = $_POST['password'];
    $password_hash = md5($_POST['password']);
    $password_hash_sql = addslashes($password_hash);
    $ip = $_SERVER['REMOTE_ADDR'];
    $ip_sql = addslashes($ip);
    $agent = $_SERVER['HTTP_USER_AGENT'];
    $agent_sql = addslashes($agent);
    $result = query("SELECT * FROM users WHERE USERNAME='$username_sql' AND PASSWORD='$password_hash_sql'");
    if ($result->fetch_assoc()) {
        // password ok
        $token = md5(random_bytes(32));
        $token_sql = addslashes(md5($token));
        query("INSERT INTO sessions (USERNAME, IP, COOKIE, AGENT, STATUS) VALUES ('$username_sql', '$ip_sql', '$token_sql', '$agent_sql', 1)");
        $data['token'] = $token;
        $data['username'] = $username;
    } else {
        // bad password, log the attempt but do not log bad password
        query("INSERT INTO sessions (USERNAME, IP, COOKIE, AGENT, STATUS) VALUES ('$username_sql', '$ip_sql', '== BAD LOGIN ==', '$agent_sql', -1)");
        sleep($CFG['BAD_LOGINS']['DELAY']);
    }
    $result->free();
}

echo(json_encode($data));
