<?php

class debug
{
    public $start_time;
    public $data;
    public $query_count;
    public $query_time;
    public $commit = true;
    public $restricted_keys = array('DB_PASS', 'DB_PASSWORD', 'PASS', 'PASSWORD');

    public function __construct()
    {
        $this->start_time = microtime(true);
        $this->data = array();
        $this->query_count = 0;
        $this->query_time = 0;
    }

    public function d($tag, $value)
    {
        $elapsed = number_format(microtime(true) - $this->start_time, 3) . 's';
        if (!isset($value)) {
            $this->data[] = array($elapsed, $tag, "Value not set");
        } elseif (is_array($value)) {
            $copy = $value; // forces copy!!!
            // remove 'DB_PASS' from array
            foreach ($this->restricted_keys as $key) {
                if (array_key_exists($key, $copy)) {
                    $copy[$key] = "***************";
                }
            }
            $this->data[] = array($elapsed, $tag, $copy);
        } else {
            $this->data[] = array($elapsed, $tag, $value);
        }
    }

    public function q($duration, $query)
    {
        $num = ++$this->query_count;
        $this->query_time += $duration;
        $time = number_format($duration, 3);
        $this->d("[#$num] Query", "[$time" . "s] $query");
    }

    public function captureEnvironment()
    {
        global $CFG;
        $this->d("GET vars", $_GET);
        $this->d("POST vars", $_POST);
        $this->d("SERVER vars", $_SERVER);
        $this->d("SESSION vars", $_SESSION);
        $this->d("COOKIE vars", $_COOKIE);
        $this->d("CONFIGURATION vars", $CFG);
    }

    public function page_time()
    {
        return $this->secs(microtime(true));
    }

    public function query_count()
    {
        return $this->query_count;
    }

    public function query_time()
    {
        return number_format($this->query_time, 3);
    }

    public function secs($time)
    {
        return number_format($time - $this->start_time, 3);
    }

    public function data()
    {
        return $this->data;
    }

    public function commit()
    {
        return $this->commit;
    }

    public function info()
    {
        $this->captureEnvironment();
        $result = array(
          'data' => $this->data(),
          'queryCount' => $this->query_count(),
          'queryTime' => $this->query_time(),
          'pageTime' => $this->page_time(),
          'commit' => $this->commit()
      );
      return $result;
    }
}
