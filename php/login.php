<?php

require_once('core/include.php');
require_once('authCheck.php');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

checkRequestMethod('POST');

$salt = $CFG['PASSWORD_SALT'];
$hash_alg = $CFG['HASH_ALG'];
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
      $user_id = $user['id'];
      while(true) {
        $token = hash($hash_alg, random_bytes(64));
        $token_sql = addslashes(hash($hash_alg, $token));
        if(get_single_row("SELECT * FROM sessions WHERE token='$token_sql'") == null) {
          query("INSERT INTO sessions (userid, ip, token, agent, status) " .
            "VALUES ($user_id, '$ip_sql', '$token_sql', '$agent_sql', 1)");
          $data['token'] = $token;
          $data['email'] = $user['email'];
          break;
        }
      }
    } else {
        // bad password, log the attempt but do not log bad password
        query("INSERT INTO badlogins (email, ip, agent) VALUES ('$email_sql', '$ip_sql', '$agent_sql')");
        sleep($CFG['BAD_LOGINS']['DELAY']);
    }
    $result->free();
}

echo(json_encode($data));
