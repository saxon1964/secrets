<?php

require_once('core/include.php');
require_once('authCheck.php');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

checkVueRequestMethod('POST');

$salt = 'c4r4mb4';
$hash_alg = 'sha512';
$data = array('token' => '', 'email' => '');

if (isset($_POST['email']) && isset($_POST['password'])) {
    $email = $_POST['email'];
    $email_sql = addslashes($email);
    $password = $_POST['password'];
    $password_hash = hash($hash_alg, $salt . $password);
    $password_hash_sql = addslashes($password_hash);
    $ip = $_SERVER['REMOTE_ADDR'];
    $ip_sql = addslashes($ip);
    $agent = $_SERVER['HTTP_USER_AGENT'];
    $agent_sql = addslashes($agent);
    $result = query("SELECT * FROM users WHERE email='$email_sql' AND password='$password_hash_sql' AND active=1");
    if ($user = $result->fetch_assoc()) {
        // password ok
        $token = hash($hash_alg, random_bytes(64));
        $token_sql = addslashes(hash($hash_alg, $token));
        query("INSERT INTO sessions (email, ip, token, agent, status) " .
          "VALUES ('$email_sql', '$ip_sql', '$token_sql', '$agent_sql', 1)");
        $data['token'] = $token;
        $data['email'] = $user['email'];
    } else {
        // bad password, log the attempt but do not log bad password
        query("INSERT INTO sessions (email, ip, token, agent, status) " .
          "VALUES ('$email_sql', '$ip_sql', '=== BAD LOGIN ===', '$agent_sql', -1)");
        sleep($CFG['BAD_LOGINS']['DELAY']);
    }
    $result->free();
}

echo(json_encode($data));
