<?php

require_once('core/include.php');
require_once('authCheck.php');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

echo json_encode(
    array(
      'status' => (getAuthToken() != null) ? 1 : 0
    )
);
