<?php

require_once("conf.php");
require_once("html2text.php");

// error reporting
error_reporting(E_ALL);

// set time zone
date_default_timezone_set($CFG['TIME_ZONE']);

function movies_error_handler($errno, $errstr, $errfile, $errline)
{
    global $dbg;
    $should_exit = false;
    $should_rollback = false;
    $should_report = false;
    $error_type = "";
    switch ($errno) {
        case E_ERROR:
            $should_exit = true;
            $should_rollback = true;
            $should_report = true;
            $error_type = "ERROR";
            break;
        case E_USER_ERROR:
            $should_exit = true;
            $should_rollback = true;
            $should_report = true;
            $error_type = "USER ERROR";
            break;
        case E_WARNING:
            $should_exit = true;
            $should_rollback = true;
            $should_report = true;
            $error_type = "WARNING";
            break;
        case E_USER_WARNING:
            $should_exit = true;
            $should_rollback = false;
            $should_report = true;
            $error_type = "USER WARNING";
            break;
        default:
            $should_exit = false;
            $should_rollback = false;
            $should_report = false;
            $error_type = "NOTICE";
            break;
    }
    //$msg = "Internal software error, something crashed.";
    $msg = "$error_type in $errfile (line #$errline): $errno: $errstr";
    $rlb = $should_rollback ? " [ROLLBACK]" : "";
    $msg = "$error_type in $errfile (line #$errline): $errno: $errstr$rlb";
    $dbg->d($error_type, $msg);
    if ($should_report) {
        echo $msg;
    }
    if ($should_rollback) {
        $dbg->commit = false;
    }
    if ($should_exit) {
        exit(-1);
    }
    return true;
}

set_error_handler("movies_error_handler");

// query function
function query($query)
{
    global $dbg, $mysqli;
    $_query = strtolower(trim($query));
    // find command in question
    $blank_pos = strpos($_query, ' ');
    $command = ($blank_pos !== false) ? substr($_query, 0, $blank_pos) : $_query;
    // sanity check - update query without where condition
    if (($command == 'update' || $command == 'delete') && strpos($_query, 'where') === false) {
        trigger_error("Refusing to execute update query without WHERE condition: $query", E_USER_ERROR);
    }
    $query_start_time = microtime(true);
    $result = $mysqli->query($query);
    $time = microtime(true) - $query_start_time;
    $dbg->q($time, $query);
    if (!$result) {
        // we have an error
        trigger_error("Query failed: [$query]: " . $mysqli->errno . ": " . $mysqli->error, E_USER_ERROR);
    } else {
        // return result for select or mysql_affected_rows() for delete and update
        if ($command == 'select') {
            return $result;
        } elseif ($command == 'delete' || $command == 'update') {
            return $mysqli->affected_rows;
        } else {
            return 0;
        }
    }
}

// database shutdown function
function movies_shutdown_hook()
{
    global $dbg;
    $query = $dbg->commit ? "COMMIT" : "ROLLBACK";
    @query($query);
}

// connect to database
$mysqli = new mysqli($CFG['DB_HOST'], $CFG['DB_USER'], $CFG['DB_PASS'], $CFG['DB_NAME']);
if ($mysqli->connect_errno) {
    trigger_error("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error, E_USER_ERROR);
}

// register shutdown function
register_shutdown_function('movies_shutdown_hook');
query("BEGIN");
query("SET NAMES " . $CFG['CODE_PAGE']['mysql']);

// register session
session_start();

// delete this if we everr have to write something to the session file
session_write_close();

// FORMATTING

function stripq($title)
{
    $title = trim(html_entity_decode($title));
    $len = strlen($title);
    if ($title[0] == '"' && $title[$len - 1] == '"') {
        $title = substr($title, 1, $len - 2);
    }
    return $title;
}

function format_default($s)
{
    // preserve unicode characters
    // $s = preg_replace('/&#([xXa-fA-F0-9]+);/is', '%%%$1%%%;', $s);
    $s = preg_replace('/&(.+?);/is', '%%%$1%%%;', $s);
    //$s = str_replace('&nbsp;', '%%%nbsp%%%', $s);
    $s = htmlspecialchars($s, ENT_QUOTES);
    //$s = preg_replace('/%%%([xXa-fA-F0-9]+)%%%;/is', '&#$1;', $s);
    $s = preg_replace('/%%%(.+?)%%%;/is', '&$1;', $s);
    //$s = str_replace('%%%nbsp%%%', '&nbsp;', $s);
    return trim($s);
}

function strip_html($quote)
{
    $quote = str_replace("\n", ' ', $quote);
    $quote = str_replace("&nbsp;", '[nbsp]', $quote);
    $quote = preg_replace('|<br ?/?> *|is', "\n", $quote);
    $quote = str_replace('<script ', '<!-- ', $quote);
    $quote = str_replace('</script>', ' -->', $quote);
    $quote = strip_tags($quote, '<b><i><small><a>');
    $quote = str_replace('</b>', '[/b]', $quote);
    $quote = preg_replace('|<b ?[^>]*>|is', '[b]', $quote);
    $quote = str_replace('</i>', '[/i]', $quote);
    $quote = preg_replace('|<i ?[^>]*>|is', '[i]', $quote);
    $quote = str_replace('<small>', '[small]', $quote);
    $quote = str_replace('</small>', '[/small]', $quote);
    $quote = str_replace('</a>', '[/a]', $quote);
    $quote = preg_replace('|<a ?[^>]*>|is', '[a]', $quote);
    return trim($quote);
}

function strip_quote($quote)
{
    $quote = str_replace("\n", ' ', $quote);
    $quote = str_replace("&nbsp;", '[nbsp]', $quote);
    $quote = preg_replace('|<br ?/?> *|is', "\n", $quote);
    $quote = preg_replace('|<script[^>]*>(.*?)</script>|is', '', $quote);
    $quote = preg_replace('|<span class="character">\s*(.*?)\s*</span>|is', '<b>$1</b>', $quote);
    $quote = preg_replace('|<p>\s*(.*?)\s*</p>|is', "$1\n", $quote);
    $quote = strip_tags($quote, '<b><i><small>');
    $quote = str_replace('</b>', '[/b]', $quote);
    $quote = str_replace('<b>', '[b]', $quote);
    $quote = str_replace('</i>', '[/i]', $quote);
    $quote = str_replace('<i>', '[i]', $quote);
    $quote = str_replace('<small>', '[small]', $quote);
    $quote = str_replace('</small>', '[/small]', $quote);
    return trim($quote);
}

function get_imdb_rating_votes($num)
{
    $rating = $votes = 0;
    $query = "SELECT URL FROM movies WHERE NUM=$num";
    $res = query($query);
    if ($m = $res->fetch_assoc()) {
        $url = $m['URL'];
        $movie = new imdb($url);
        $rating = $movie->rating();
        $votes = (int) str_replace(',', '', $movie->votes());
        $metascore = $movie->metascore();
    }
    $res->free();
    return array($rating, $votes, $metascore);
}

function get_decoration_image_paths($folder)
{
    $directory = str_replace('\\', '/', $_SERVER["DOCUMENT_ROOT"]) . $folder;
    $image_names = scandir($directory);
    $image_paths = array();
    for ($i = 0; $i < count($image_names); $i++) {
        $image = $image_names[$i];
        if ($image != '.' && $image != '..') {
            $image_paths[] = "$directory/$image";
        }
    }
    usort($image_paths, 'sort_files_newest_first');
    return $image_paths;
}

function format_num($num, $width = 4, $prefix = '#')
{
    $fnum = (int) $num;
    while (strlen($fnum) < $width) {
        $fnum = "0$fnum";
    }
    $fnum = "$prefix$fnum";
    return $fnum;
}

function parse_source($youtube)
{
    global $CFG;
    $ok = preg_match($CFG['YOUTUBE_FORMAT'], $youtube, $matches);
    if ($ok) {
        return $matches[1];
    } else {
        return '';
    }
}

/////////////////////// DATA UPDATE ////////////////////////////

function update_attribute_table($num, $table, $column, $attributes)
{
    $attrs = explode_list($attributes);
    // create value list
    $values = '';
    $count = 0;
    foreach ($attrs as $attr) {
        $html2TextConverter = new Html2Text($attr);
        $a = addslashes($html2TextConverter->getText());
        if ($values != '') {
            $values .= ', ';
        }
        $values .= "($num, '$a', $count)";
        $count++;
    }
    // delete old data
    $query = "DELETE FROM $table WHERE NUM=$num";
    query($query);
    if ($count > 0) {
        // update
        $query = "INSERT INTO $table (num, $column, sort) VALUES $values";
        query($query);
    }
}

function update_attribute_table_with_descr($num, $table, $column, $attributes, $start_count)
{
    $attrs = explode_table2($attributes);
    // create value list
    $values = '';
    $count = $start_count;
    foreach ($attrs as $attr) {
        $html2TextConverter = new Html2Text($attr[0]);
        $a = addslashes($html2TextConverter->getText());
        $html2TextConverter = new Html2Text($attr[1]);
        $d = addslashes($html2TextConverter->getText());
        if ($values != '') {
            $values .= ', ';
        }
        $values .= "($num, '$a', $count, '$d')";
        $count++;
    }
    // delete old data
    $query = "DELETE FROM $table WHERE NUM=$num AND SORT>=$start_count ";
    query($query);
    if ($count > $start_count) {
        // update
        $query = "INSERT INTO $table (num, $column, sort, description) VALUES $values";
        query($query);
    }
}

function update_names($num, $names_array, $type)
{
    $names = explode_table3($names_array);
    // create value list for roles and names tables
    $role_values = '';
    $name_values = '';
    $count = 0;
    foreach ($names as $name) {
        if (strlen($name[0]) == 0 || strlen($name[1]) == 0) {
            print_r($names_array);
            trigger_error("Invalid name encountered", E_USER_ERROR);
        }
        $imdbid = addslashes($name[0]);
        $html2TextConverter = new Html2Text($name[1]);
        $nm = addslashes($html2TextConverter->getText());
        $html2TextConverter = new Html2Text($name[2]);
        $role = addslashes($html2TextConverter->getText());
        // roles
        if ($role_values != '') {
            $role_values .= ', ';
        }
        $role_values .= "($num, '$imdbid', '$role', $count, $type)";
        // names
        if ($name_values != '') {
            $name_values .= ', ';
        }
        $name_values .= "('$imdbid', '$nm', null, 0)";
        $count++;
    }
    // delete old roles
    $query = "DELETE FROM roles WHERE NUM=$num AND TYPE=$type";
    query($query);
    if ($count > 0) {
        // update roles
        $query = "INSERT INTO roles (num, imdbid, role, sort, type) VALUES $role_values";
        query($query);
        // update names
        $query = "INSERT INTO names (imdbid, name, picturename, picturestatus) VALUES $name_values ON DUPLICATE KEY UPDATE name=VALUES(name)";
        query($query);
    }
}

function update_directors($num, $directors)
{
    update_names($num, $directors, 0);
}

function update_actors($num, $actors)
{
    update_names($num, $actors, 1);
}

function update_credits($num, $credits)
{
    update_names($num, $credits, 2);
}

function update_producers($num, $producers)
{
    update_names($num, $producers, 3);
}

function update_music($num, $music)
{
    update_names($num, $music, 4);
}

function update_countries($num, $countries)
{
    update_attribute_table($num, 'countries', 'COUNTRY', $countries);
}

function update_categories($num, $categories)
{
    update_attribute_table($num, 'categories', 'CATEGORY', $categories);
}

function update_languages($num, $languages)
{
    update_attribute_table($num, 'languages', 'LANGUAGE', $languages);
}

function update_main_titles($num, $display, $sort, $inter)
{
    // remove old data
    query("DELETE FROM titles WHERE NUM=$num AND SORT<10");
    // original title -> 0, sorting title -> 1, international title -> 2
    $html2TextConverter = new Html2Text(trim($display));
    $d = addslashes($html2TextConverter->getText());
    query("INSERT INTO titles (NUM, TITLE, DESCRIPTION, SORT) VALUES ($num, '$d', 'Display title', 0)");
    $html2TextConverter = new Html2Text(trim($sort));
    $s = addslashes($html2TextConverter->getText());
    query("INSERT INTO titles (NUM, TITLE, DESCRIPTION, SORT) VALUES ($num, '$s', 'Sorting title', 1)");
    if (strlen(trim($inter)) > 0) {
        $html2TextConverter = new Html2Text(trim($inter));
        $i = addslashes($html2TextConverter->getText());
        query("INSERT INTO titles (NUM, TITLE, DESCRIPTION, SORT) VALUES ($num, '$i', 'International title', 2)");
    }
}

function update_titles($num, $titles)
{
    update_attribute_table_with_descr($num, 'titles', 'title', $titles, 10);
}

function update_keywords($num, $keywords)
{
    update_attribute_table($num, 'keywords', 'keyword', $keywords);
}

function update_companies($num, $companies)
{
    update_attribute_table_with_descr($num, 'companies', 'company', $companies, 0);
}

function update_quotes($num, $quotes)
{
    update_text($num, 'quotes', 'quote', $quotes);
}

function update_trivia($num, $trivia)
{
    update_text($num, 'trivias', 'trivia', $trivia);
}

function update_text($num, $table, $column, $text)
{
    global $CFG;
    query("delete from $table where num=$num");
    $items = explode($CFG['RULER_TEXT'], $text);
    $sort = 1;
    $values = '';
    foreach ($items as $item) {
        $item = addslashes(trim($item));
        if (strlen($item) > 0) {
            if (strlen($values) > 0) {
                $values .= ', ';
            }
            $values .= "($num, '$item', $sort)";
            $sort++;
        }
    }
    if (strlen($values) > 0) {
        query("INSERT INTO $table (num, $column, sort) VALUES $values");
    }
}

function update_locations($num, $locations_str)
{
    query("DELETE FROM locations WHERE DELETED=0 AND NUM=$num");
    $locations = explode_table5($locations_str);
    foreach ($locations as $loc) {
        $hd = (int) trim($loc[0]);
        $folder = trim($loc[1]);
        if ((int)$folder > 0) {
            $folder = format_num($folder, 4, '');
        }
        $folder = addslashes($folder);
        $info = addslashes(trim($loc[2]));
        $subtitles = addslashes(trim($loc[3]));
        $dldate = addslashes(trim($loc[4]));
        if (strlen($dldate) > 0) {
            query("INSERT INTO locations (NUM, HD, FOLDER, INFO, SUBTITLES, DELETED, DLDATE) VALUES ($num, $hd, '$folder', '$info', '$subtitles', 0, '$dldate')");
        } else {
            query("INSERT INTO locations (NUM, HD, FOLDER, INFO, SUBTITLES, DELETED, DLDATE) VALUES ($num, $hd, '$folder', '$info', '$subtitles', 0, null)");
        }
    }
}

///////////////////// EDITABLE ATTRIBUTES ////////////////////////////

function get_editable_names($num, $type)
{
    global $CFG;
    $sep1 = $CFG['AKA_SEPARATOR'];
    $sep2 = $CFG['AKA_SEPARATOR_2'];
    $str = '';
    $result = query("SELECT names.imdbid, names.name, roles.role from roles, names WHERE roles.num=$num and roles.imdbid=names.imdbid AND roles.type=$type ORDER BY roles.sort");
    while ($n = $result->fetch_row()) {
        if ($str != '') {
            $str .= $sep2;
        }
        $str .= "$n[0]$sep1$n[1]$sep1$n[2]";
    }
    $result->free();
    return $str;
}

function get_editable_list($num, $table, $column)
{
    global $CFG;
    $sep1 = $CFG['AKA_SEPARATOR'];
    $attrs = '';
    $result = query("SELECT $column FROM $table WHERE NUM=$num ORDER BY SORT ASC");
    while ($m = $result->fetch_row()) {
        if (strlen($attrs) > 0) {
            $attrs .= $sep1;
        }
        $attrs .= $m[0];
    }
    $result->free();
    return $attrs;
}

function get_editable_table($num, $table, $column, $sort_min = 0)
{
    global $CFG;
    $sep1 = $CFG['AKA_SEPARATOR'];
    $sep2 = $CFG['AKA_SEPARATOR_2'];
    $attrs = '';
    $result = query("SELECT $column, description FROM $table WHERE NUM=$num AND SORT>=$sort_min ORDER BY SORT ASC");
    while ($m = $result->fetch_row()) {
        if (strlen($attrs) > 0) {
            $attrs .= $sep2;
        }
        $attrs .= "$m[0]$sep1$m[1]";
    }
    $result->free();
    return $attrs;
}

function get_display_title($num)
{
    return get_single_value("SELECT TITLE from titles WHERE NUM=$num and SORT=0");
}

function get_original_title($num)
{
    return get_display_title($num);
}

function get_sorting_title($num)
{
    return get_single_value("SELECT TITLE from titles WHERE NUM=$num and SORT=1");
}

function get_inter_title($num)
{
    return get_single_value("SELECT TITLE from titles WHERE NUM=$num and SORT=2");
}

function get_media($num)
{
    global $CFG;
    $media = array();
    // FIRST: Locaitons with dates
    $query = "SELECT FOLDER, HD, INFO, SUBTITLES, DLDATE from locations WHERE DELETED=0 AND NUM=$num AND DLDATE IS NOT NULL ORDER BY DLDATE DESC";
    $result = query($query);
    while ($m = $result->fetch_assoc()) {
        $media[] = array($m['FOLDER'], $m['HD'], $m['INFO'], $m['SUBTITLES'], $m['DLDATE']);
    }
    $result->free();
    // THEN - HD!
    $hd_folders = $CFG['HD_FOLDERS_SQL'];
    $query = "SELECT FOLDER, HD, INFO, SUBTITLES, DLDATE from locations WHERE DELETED=0 AND NUM=$num AND DLDATE IS NULL AND FOLDER IN ($hd_folders) ORDER BY HD DESC";
    $result = query($query);
    while ($m = $result->fetch_assoc()) {
        $media[] = array($m['FOLDER'], $m['HD'], $m['INFO'], $m['SUBTITLES'], $m['DLDATE']);
    }
    $result->free();
    // THEN - SD!
    $sd_folders = $CFG['SD_FOLDERS_SQL'];
    $query = "SELECT FOLDER, HD, INFO, SUBTITLES, DLDATE from locations WHERE DELETED=0 AND NUM=$num AND DLDATE IS NULL AND FOLDER IN ($sd_folders) ORDER BY HD DESC";
    $result = query($query);
    while ($m = $result->fetch_assoc()) {
        $media[] = array($m['FOLDER'], $m['HD'], $m['INFO'], $m['SUBTITLES'], $m['DLDATE']);
    }
    $result->free();
    // FINALLY - ORDINARY FOLDERS
    $query = "SELECT FOLDER, HD, INFO, SUBTITLES, DLDATE from locations WHERE DELETED=0 AND NUM=$num AND DLDATE IS NULL AND FOLDER NOT IN ($hd_folders) AND FOLDER NOT IN ($sd_folders) ORDER BY FOLDER DESC";
    $result = query($query);
    while ($m = $result->fetch_assoc()) {
        $media[] = array($m['FOLDER'], $m['HD'], $m['INFO'], $m['SUBTITLES'], $m['DLDATE']);
    }
    $result->free();
    return $media;
}

function get_editable_location($num)
{
    global $CFG;
    $sep1 = $CFG['AKA_SEPARATOR'];
    $sep2 = $CFG['AKA_SEPARATOR_2'];
    $s = '';
    $m = get_media($num);
    foreach ($m as $loc) {
        if (strlen($s) > 0) {
            $s .= $sep2;
        }
        $s .= "$loc[1]$sep1$loc[0]$sep1$loc[2]$sep1$loc[3]$sep1$loc[4]";
    }
    return $s;
}

//-------------------- HELPER FUNCTIONS -----------------------

function get_single_row($query)
{
    $result = query($query);
    $row = $result->fetch_array();
    $result->free();
    return $row;
}

function get_single_row_assoc($query)
{
    $result = query($query);
    $row = $result->fetch_assoc();
    $result->free();
    return $row;
}

function get_single_value($query)
{
    $value = null;
    $row = get_single_row($query);
    if ($row) {
        $value = $row[0];
    }
    return $value;
}

function get_number_stat($query)
{
    return (float) get_single_value($query);
}

function get_integer_stat($query)
{
    return (int) get_single_value($query);
}

function get_movie_count()
{
    return get_integer_stat("SELECT COUNT(*) FROM movies");
}

function get_hidden_movie_count()
{
    return get_integer_stat("SELECT COUNT(*) FROM movies WHERE HIDDEN>0");
}

function get_top250_movie_count()
{
    return get_integer_stat("SELECT COUNT(NUM) FROM movies WHERE TOP250>0");
}

function get_hd_movie_count()
{
    return get_integer_stat("SELECT COUNT(NUM) FROM movies WHERE quality is not null and quality<>''");
}

function get_last_movie_num()
{
    return get_integer_stat("SELECT MAX(ID) FROM movies");
}

function get_last_hd()
{
    $id = get_last_movie_num();
    return get_integer_stat("SELECT MAX(HD) FROM locations");
}

function get_last_used_hd()
{
    return get_integer_stat("SELECT HD FROM locations ORDER BY DLDATE DESC, HD DESC LIMIT 1");
}

function get_next_movie_id()
{
    $count = get_movie_count();
    if (get_last_movie_num() == $count) {
        return $count + 1;
    }
    $id = 1;
    $query = "SELECT ID FROM movies ORDER BY ID";
    $result = query($query);
    while ($m = $result->fetch_assoc()) {
        if ($id == $m['ID']) {
            $id++;
        } else {
            break;
        }
    }
    $result->free();
    return $id;
}

function get_bios_count()
{
    return get_integer_stat("SELECT COUNT(DISTINCT imdbid) FROM bios");
}

/////////////////////////////////////////////////////////////////////////////////////////////
// IMAGES
/////////////////////////////////////////////////////////////////////////////////////////////

function get_absolute_path($relative_path)
{
    return str_replace('\\', '/', $_SERVER["DOCUMENT_ROOT"]) . '/' . $relative_path;
}

// thumbnail, poster functions

function get_image_file($file)
{
    return str_replace('\\', '/', $_SERVER["DOCUMENT_ROOT"]) . '/' . get_image_relative_path($file);
}

function get_image_name_for($uploaded, $num, $poster = false)
{
    global $CFG;
    $index = "$num";
    while (strlen($index) < 4) {
        $index = "0$index";
    }
    $dotpos = strrpos($uploaded, '.');
    if ($dotpos === false) {
        trigger_error("File without extension: " . $uploaded, E_USER_ERROR);
    }
    $ext = substr($uploaded, $dotpos);
    $prefix = $poster ? $CFG['POSTER_PREFIX'] : $CFG['THUMB_PREFIX'];
    $hash = '__' . random_string();
    $file = "$prefix$index$hash$ext";
    return $file;
}

function get_image_relative_path($file)
{
    global $CFG;
    $prefix = substr($file, 0, strlen($CFG['POSTER_PREFIX']));
    if ($file != null && ($prefix == $CFG['POSTER_PREFIX'] || $prefix == $CFG['THUMB_PREFIX'])) {
        // thumbnail or poster
        if (preg_match("|$prefix" . "[0-9]{5}.*|i", $file)) {
            // we have more than 10000 movies
            $i = $file[5];
            $j = $file[6];
        } else {
            $i = $file[4];
            $j = $file[5];
        }
        $path = "t/$i/$j/$file";
        return $path;
    } elseif ($file != null && $prefix == $CFG['ACTOR_PREFIX']) {
        // actor, take last two digits as directory hash
        $dotpos = strrpos($file, '.');
        if ($dotpos !== false) {
            $i = $file[$dotpos - 2];
            $j = $file[$dotpos - 1];
            $path = "f/$i/$j/$file";
            return $path;
        }
    }
    return 't/' . $CFG['THUMB_MISSING'];
}

function get_image_name($num, $poster = false)
{
    $picture = null;
    $column = $poster ? "POSTERNAME" : "PICTURENAME";
    $result = query("SELECT $column FROM movies WHERE NUM=$num");
    if ($m = $result->fetch_assoc()) {
        $picture = $m[$column];
    }
    $result->free();
    if ($picture == '' || $picture == null) {
        return null;
    } else {
        return $picture;
    }
}

function upload_image($field, $num)
{
    $tmp_path = $_FILES[$field]['tmp_name'];
    $original_name = basename($_FILES[$field]['name']);
    return save_image($num, $tmp_path, $original_name);
}

function upload_from_url($url, $num)
{
    // get image content
    $content = get_page($url) or trigger_error("Could not load image from URL $url", E_USER_ERROR);
    // find extension
    $dotpos = strrpos($url, '.');
    $ext = strtolower(substr($url, $dotpos));
    if ($ext != '.jpg' && $ext != '.jpeg' && $ext != '.png' && $ext != '.gif') {
        $ext = '.jpg';
    }
    // create temporary file
    $tmp_path = tempnam('/tmp', 'luka') . $ext;
    $handle = fopen($tmp_path, 'w') or trigger_error("Cannot open temporary file $tmp_path for writing", E_USER_ERROR);
    fwrite($handle, $content);
    fclose($handle);
    // move this, save as a poster
    return save_image($num, $tmp_path, $ext);
}

function save_image($num, $tmp_path, $original_name)
{
    global $CFG;
    // move this, save as a poster
    $poster_name = get_image_name_for($original_name, $num, true);
    $poster_path = get_image_file($poster_name);
    rename($tmp_path, $poster_path);
    chmod($poster_path, $CFG['UPLOADED_FILE_PERMISSIONS']);
    // rescale poster if necessary
    $img = new SimpleImage();
    $img->load($poster_path);
    $width = $img->getWidth();
    $height = $img->getHeight();
    if($height >= $width && $width > $CFG['TARGET_POSTER_DIMENSION']) {
      $img->resizeToWidth($CFG['TARGET_POSTER_DIMENSION']);
    }
    else if($width > $height && $height > $CFG['TARGET_POSTER_DIMENSION']) {
      $img->resizeToHeight($CFG['TARGET_POSTER_DIMENSION']);
    }
    // save anyway, just to have the right compression ratio
    $img->save($poster_path, IMAGETYPE_JPEG, $CFG['TARGET_POSTER_COMPRESSION'], $CFG['UPLOADED_FILE_PERMISSIONS']);
    // create thumbnail from poster
    $thumb_name = get_image_name_for($original_name, $num, false);
    $thumb_path = get_image_file($thumb_name);
    create_thumbnail_from_poster($poster_path, $thumb_path);
    chmod($thumb_path, $CFG['UPLOADED_FILE_PERMISSIONS']);
    return array($thumb_name, $poster_name);
}

function create_thumbnail_from_poster($poster_path, $thumb_path)
{
    global $CFG;
    $image = new SimpleImage();
    $image->load($poster_path);
    if ($image->getHeight() >= $image->getWidth() && $image->getWidth() > $CFG['DEFAULT_THUMB_SIZE']) {
        $image->resizeToWidth($CFG['DEFAULT_THUMB_SIZE']);
    }
    else if ($image->getWidth() >= $image->getHeight() && $image->getHeight() > $CFG['DEFAULT_THUMB_SIZE']) {
      $image->resizeToHeight($CFG['DEFAULT_THUMB_SIZE']);
    }
    $image->sharpen();
    $image->auto_save($thumb_path);
}

function delete_image($num)
{
    $name = get_image_name($num, false);
    if ($name != null) {
        $file = get_image_file($name);
        if (file_exists($file)) {
            unlink($file);
        }
    }
    $name = get_image_name($num, true);
    if ($name != null) {
        $file = get_image_file($name);
        if (file_exists($file)) {
            unlink($file);
        }
    }
}

function get_poster_dims($num)
{
    return get_single_row("SELECT POSTERWIDTH, POSTERHEIGHT FROM movies WHERE NUM=$num");
}

function get_thumbnail_dims($num) {
  $thumb = get_single_value("SELECT PICTURENAME FROM movies WHERE NUM=$num");
  $file = get_image_file($thumb);
  return getimagesize($file);
}

function get_picture_size($picture)
{
    $file = get_image_file($picture);
    return getimagesize($file);
}

function get_poster_kbytes($poster)
{
    $file = get_image_file($poster);
    return (int)(filesize($file) / 1024 + 0.5);
}

function format_poster_dims($num)
{
    $dims = get_poster_dims($num);
    return $dims[0] . ' x ' . $dims[1] . 'px';
}

// MEGAPOSTER

function get_poster($directory)
{
    global $CFG;
    $files = scandir($directory);
    $posters = array();
    foreach ($files as $file) {
        if (strpos($file, $CFG['POSTER']) !== false && !is_dir($file)) {
            $posters[] = $file;
        }
    }
    if (count($posters) > 0) {
        sort($posters);
        $file = $posters[count($posters) - 1];
        return "$directory/$file";
    } else {
        return null;
    }
}

function get_poster_data() {
  global $CFG;
  $directory = '../' . $CFG['POSTER_DIR'];
  $file = get_poster($directory);
  if($file != null) {
    $timestamp = filemtime($file);
    $date = date('d-M-Y', $timestamp);
    return array(
      'file' => substr($file, 3), // elliminates ../ at the beginning
      'timestamp' => $timestamp,
      'date' => $date
    );
  }
  else {
    return array(
      'file' => '',
      'timestamp' => 0,
      'date' => ''
    );
  }
}

function get_new_poster($directory)
{
    global $CFG;
    return $directory . '/' . $CFG['POSTER'] . '-' . time() . '.' . $CFG['POSTER_TYPE'];
}

function get_results_per_page()
{
    global $CFG;
    return $CFG['RESULTS_PER_PAGE'];
}

// AWARDS

function format_awards_summary($num)
{
    global $CFG;
    $oscar_wins = oscar_count($num, true);
    $oscar_noms = oscar_count($num, false);
    $wins = award_count($num, true);
    $noms = award_count($num, false);
    $header = '';
    if ($oscar_wins > 0) {
        if ($oscar_wins == 1) {
            $header = "Won Oscar";
        } else {
            $header = "Won $oscar_wins Oscars";
        }
        $wins -= $oscar_wins;
    } elseif ($oscar_noms > 0) {
        if ($oscar_noms == 1) {
            $header = "Nominated for Oscar";
        } else {
            $header = "Nominated for $oscar_noms Oscars";
        }
        $noms -= $oscar_noms;
    }
    $footer = '';
    if ($wins > 0) {
        $footer = "$wins win" . ($wins > 1 ? 's' : '');
    }
    if ($noms > 0) {
        if (strlen($footer) > 0) {
            $footer .= ' & ';
        }
        $footer .= "$noms nomination" . ($noms > 1 ? 's' : '');
    }
    $title = '';
    if (strlen($header) > 0 && strlen($footer) > 0) {
        $title = "$header. Another $footer";
    } elseif (strlen($header) > 0 && strlen($footer) == 0) {
        $title = "$header";
    } elseif (strlen($header) == 0 && strlen($footer) > 0) {
        $title = "$footer";
    }
    return $title;
}

function map_nodes($array)
{
    $total = 0;
    foreach ($array as $elem) {
        if (is_array($elem)) {
            $total += map_nodes($elem);
        } else {
            $total++;
        }
    }
    return $total;
}

function award_count($num, $won)
{
    global $CFG;
    $win_sql = $CFG['AWARDS_WON_SQL'];
    if ($won) {
        return get_integer_stat("SELECT COUNT(*) FROM awards WHERE NUM=$num AND RESULT IN ($win_sql)");
    } else {
        return get_integer_stat("SELECT COUNT(*) FROM awards WHERE NUM=$num AND RESULT NOT IN ($win_sql)");
    }
}

function oscar_count($num, $won)
{
    global $CFG;
    $win_sql = $CFG['AWARDS_WON_SQL'];
    if ($won) {
        return get_integer_stat("SELECT COUNT(*) FROM awards WHERE NUM=$num AND award='Oscar' AND RESULT IN ($win_sql)");
    } else {
        return get_integer_stat("SELECT COUNT(*) FROM awards WHERE NUM=$num AND award='Oscar' AND RESULT NOT IN ($win_sql)");
    }
}

function update_awards($num, $awards)
{
    // should return true if award count has been updated
    $old_won_count = award_count($num, true);
    $old_nom_count = award_count($num, false);
    $old_count = $old_nom_count + $old_won_count;
    if (!isset($awards)) {
        $awards = array();
    }
    $new_count = count($awards);
    if ($new_count <= $old_count / 2) {
        return false;
    }
    query("DELETE FROM awards WHERE NUM=$num");
    query("UPDATE movies SET AWARD_SUMMARY='' WHERE NUM=$num");
    $values = '';
    foreach ($awards as $award) {
        $awards_won = $awards_total = 0;
        $inst = addslashes($award[0]);
        $year = (int)$award[1];
        $res = addslashes($award[2]);
        $awd = addslashes($award[3]);
        $category = addslashes($award[4]);
        $sort = (int)$award[5];
        if ($values != '') {
            $values .= ', ';
        }
        $values .= "($num, '$inst', $year, '$res', '$awd', '$category', $sort)";
    }
    $retval = false;
    if ($values != '') {
        query("INSERT INTO awards (NUM, ORGANISATION, YEAR, RESULT, AWARD, CATEGORY, SORT) VALUES $values");
        $s = addslashes(strip_tags(format_awards_summary($num)));
        query("UPDATE movies SET AWARD_SUMMARY='$s' WHERE NUM=$num");
        $new_won_count = award_count($num, true);
        $new_nom_count = award_count($num, false);
        if ($old_won_count != $new_won_count || $old_nom_count != $new_nom_count) {
            $retval = true;
        }
    }
    return $retval;
}

//////////////////////// HELPER FUNCTIONS FOR THE HOMEPAGE ////////////////////

function get_bulk_country($num_array)
{
    $array = array();
    foreach ($num_array as $num) {
        $array[$num] = array();
    }
    $in = array_to_string($num_array);
    $query = "SELECT num, countries.country, description, concat('/g/f/',countries.COUNTRY,'.gif') AS flag, name, sort FROM countries, world WHERE countries.country = world.country AND num in ($in) ORDER BY num, sort";
    $result = query($query);
    while ($c = $result->fetch_assoc()) {
        $array[$c['num']][] = array('NUM' => $c['num'], 'COUNTRY' => $c['country'], 'DESCRIPTION' => $c['description'], 'FLAG' => $c['flag'], 'NAME' => $c['name'], 'SORT' => $c['sort']);
    }
    return $array;
}

function get_bulk_director($num_array)
{
    $array = array();
    foreach ($num_array as $num) {
        $array[$num] = array();
    }
    $in = array_to_string($num_array);
    $query = "select num, roles.imdbid, name, role, picturestatus, picturename, score, sort, type from roles, names where roles.imdbid=names.imdbid and type=0 and num in ($in) order by num, sort";
    $result = query($query);
    while ($d = $result->fetch_row()) {
        $array[$d[0]][] = array('NUM' => $d[0], 'IMDBID' => $d[1], 'NAME' => $d[2], 'ROLE' => $d[3], 'PICTURESTATUS' => $d[4], 'PICTURENAME' => $d[5],
            'SCORE' => $d[6], 'SCORE' => $d[7], 'TYPE' => $d[8]);
    }
    $result->free();
    return $array;
}

function get_bulk_category($num_array)
{
    $array = array();
    foreach ($num_array as $num) {
        $array[$num] = array();
    }
    $in = array_to_string($num_array);
    $query = "select num, category, description, sort from categories where num in ($in) order by num, sort";
    $result = query($query);
    while ($c = $result->fetch_row()) {
        $array[$c[0]][] = array('NUM' => $c[0], 'CATEGORY' => $c[1], 'DESCRIPTION' => $c[2], 'SORT' => $c[3]);
    }
    return $array;
}

function get_bulk_location($num_array)
{
    $array = array();
    foreach ($num_array as $num) {
        $array[$num] = array();
    }
    $in = array_to_string($num_array);
    $query = "select num, hd, folder, info, subtitles, dldate from locations where num in ($in) and deleted = 0 order by num, dldate desc";
    $result = query($query);
    while ($l = $result->fetch_row()) {
        $array[$l[0]][] = array('NUM' => $l[0], 'HD' => $l[1], 'FOLDER' => $l[2], 'INFO' => $l[3], 'SUBTITLES' => $l[4], 'DLDATE' => $l[5]);
    }
    return $array;
}

function get_bulk_display_title($num_array)
{
    $in = array_to_string($num_array);
    $query = "select num, title from titles where num in ($in) and sort=0";
    return get_bulk_field($query);
}

function get_bulk_sort_title($num_array)
{
    $in = array_to_string($num_array);
    $query = "select num, title from titles where num in ($in) and sort=1";
    return get_bulk_field($query);
}

function get_bulk_inter_title($num_array)
{
    $in = array_to_string($num_array);
    $query = "select num, title from titles where num in ($in) and sort=2";
    return get_bulk_field($query);
}

function get_bulk_aka($num_array)
{
    global $CFG;
    $in = array_to_string($num_array);
    $separator = $CFG['AKA_SEPARATOR'];
    $query = "select num, group_concat(title order by sort separator '$separator') from titles where num in ($in) and sort>=10 group by num";
    return get_bulk_field($query);
}

function get_primary_movie_data($num_array)
{
    $in = array_to_string($num_array);
    $fields = "ID, NUM, YEAR, TAGLINE, QUALITY, RATING, VOTES, SCORE, METASCORE, PICTURENAME, TV, HIDDEN, D3, URL, TOP250, LENGTH, SOURCE, DATEMODIFY, POSTERNAME, POSTERWIDTH, POSTERHEIGHT, DESCRIPTION, AWARD_SUMMARY, CERT, MPAA";
    $query = "select $fields from movies where num in ($in)";
    $result = query($query);
    $data = array();
    while ($m = $result->fetch_assoc()) {
        $num = $m['NUM'];
        foreach ($m as $field => $value) {
            $data[$num][$field] = $value;
        }
        $poster = $data[$num]['POSTERNAME'];
        $data[$num]['POSTER_KBYTES'] = get_poster_kbytes($poster);
    }
    $result->free();
    return $data;
}

function get_bulk_movie_data($num_array)
{
    $result = get_primary_movie_data($num_array);
    $a = get_bulk_country($num_array);
    foreach ($a as $num => $value) {
        $result[$num]['COUNTRY'] = $value;
    }
    $a = get_bulk_category($num_array);
    foreach ($a as $num => $value) {
        $result[$num]['CATEGORY'] = $value;
    }
    $a = get_bulk_director($num_array);
    foreach ($a as $num => $value) {
        $result[$num]['DIRECTOR'] = $value;
    }
    $a = get_bulk_display_title($num_array);
    foreach ($a as $num => $value) {
        $result[$num]['DISPLAYTITLE'] = $value;
    }
    $a = get_bulk_inter_title($num_array);
    foreach ($a as $num => $value) {
        $result[$num]['INTERTITLE'] = $value;
    }
    $a = get_bulk_aka($num_array);
    foreach ($a as $num => $value) {
        $result[$num]['AKA'] = $value;
    }
    $a = get_bulk_location($num_array);
    foreach ($a as $num => $value) {
        $result[$num]['LOCATION'] = $value;
    }
    return $result;
}

function array_to_string($num_array)
{
    $result = '-1';
    foreach ($num_array as $num) {
        $result .= ", $num";
    }
    return $result;
}

function get_bulk_field($query)
{
    $a = array();
    $result = query($query);
    while ($r = $result->fetch_row()) {
        $a[$r[0]] = $r[1];
    }
    $result->free();
    return $a;
}

//////////////////////// IMAGE MANIPULATION ///////////////////////////////////

class SimpleImage
{
    public $image;
    public $image_type;

    public function load($filename)
    {
        $image_info = getimagesize($filename);
        $this->image_type = $image_info[2];
        if ($this->image_type == IMAGETYPE_JPEG) {
            $this->image = imagecreatefromjpeg($filename);
        } elseif ($this->image_type == IMAGETYPE_GIF) {
            $this->image = imagecreatefromgif($filename);
        } elseif ($this->image_type == IMAGETYPE_PNG) {
            $this->image = imagecreatefrompng($filename);
        }
    }

    public function save($filename, $image_type=IMAGETYPE_JPEG, $compression = 80, $permissions = null)
    {
        if ($image_type == IMAGETYPE_JPEG) {
            imagejpeg($this->image, $filename, $compression);
        } elseif ($image_type == IMAGETYPE_GIF) {
            imagegif($this->image, $filename);
        } elseif ($image_type == IMAGETYPE_PNG) {
            imagepng($this->image, $filename);
        }
        if ($permissions != null) {
            chmod($filename, $permissions);
        }
    }

    public function auto_save($filename)
    {
        if (self::ends_with($filename, '.png')) {
            $this->save($filename, IMAGETYPE_PNG);
        } elseif (self::ends_with($filename, '.gif')) {
            $this->save($filename, IMAGETYPE_GIF);
        } else {
            $this->save($filename, IMAGETYPE_JPEG);
        }
    }

    public function output($image_type=IMAGETYPE_JPEG)
    {
        if ($image_type == IMAGETYPE_JPEG) {
            imagejpeg($this->image);
        } elseif ($image_type == IMAGETYPE_GIF) {
            imagegif($this->image);
        } elseif ($image_type == IMAGETYPE_PNG) {
            imagepng($this->image);
        }
    }

    public function getWidth()
    {
        return imagesx($this->image);
    }

    public function getHeight()
    {
        return imagesy($this->image);
    }

    public function resizeToHeight($height)
    {
        $ratio = $height / $this->getHeight();
        $width =  intval(floor($this->getWidth() * $ratio + 0.5));
        $this->resize($width, $height);
    }

    public function resizeToWidth($width)
    {
        $ratio = $width / $this->getWidth();
        $height = intval(floor($this->getHeight() * $ratio + 0.5));
        $this->resize($width, $height);
    }

    public function scale($scale)
    {
        $width = intval(floor($this->getWidth() * $scale / 100.0 + 0.5));
        $height = intval(floor($this->getHeight() * $scale / 100.0 + 0.5));
        $this->resize($width, $height);
    }

    public function resize($width, $height)
    {
        $new_image = imagecreatetruecolor($width, $height);
        imagecopyresampled($new_image, $this->image, 0, 0, 0, 0, $width, $height, $this->getWidth(), $this->getHeight());
        $this->image = $new_image;
    }

    public function sharpen()
    {
        global $CFG;
        $sharpenMatrix = array(
            array(-1, -1, -1),
            array(-1, $CFG['SHARPEN_FACTOR'], -1),
            array(-1, -1, -1));
        $divisor = $CFG['SHARPEN_FACTOR'] - 8;
        $offset = 0;
        imageconvolution($this->image, $sharpenMatrix, $divisor, $offset);
    }

    public static function ends_with($file, $ext)
    {
        $pos = strrpos(strtolower($file), $ext);
        return (($pos !== false) && $pos == (strlen($file) - strlen($ext)));
    }
}

////////////////////// FORMATTING FUNCTIONS //////////////////////////////////////

function format_table3_raw($array)
{
    global $CFG;
    $sep1 = $CFG['AKA_SEPARATOR'];
    $sep2 = $CFG['AKA_SEPARATOR_2'];
    $output = '';
    foreach ($array as $row) {
        $col0 = trim($row[0]);
        $col1 = trim($row[1]);
        $col2 = trim($row[2]);
        if ($output != '') {
            $output .= $sep2;
        }
        $output .= "$col0$sep1$col1$sep1$col2";
    }
    return $output;
}

function format_table3($array)
{
    return format_default(format_table3_raw($array));
}

function format_list2($array)
{
    global $CFG;
    $sep1 = $CFG['AKA_SEPARATOR'];
    $sep2 = $CFG['AKA_SEPARATOR_2'];
    $output = '';
    foreach ($array as $key => $value) {
        $col0 = trim($key);
        $col1 = trim($value);
        if ($output != '') {
            $output .= $sep2;
        }
        $output .= "$col0$sep1$col1";
    }
    return format_default($output);
}

function format_list($array, $sep = '')
{
    global $CFG;
    if ($sep == '') {
        $sep = $CFG['AKA_SEPARATOR'];
    }
    global $CFG;
    $output = '';
    foreach ($array as $value) {
        $value = trim($value);
        if ($output != '') {
            $output .= $sep;
        }
        $output .= $value;
    }
    return format_default($output);
}

function explode_table($text, $size)
{
    global $CFG;
    $result = array();
    $sep1 = $CFG['AKA_SEPARATOR'];
    $sep2 = $CFG['AKA_SEPARATOR_2'];
    $rows = explode($sep2, trim($text));
    foreach ($rows as $row) {
        $cols = explode($sep1, trim($row));
        if (count($cols) == $size) {
            $result_row = array();
            foreach ($cols as $col) {
                $result_row[] = trim($col);
            }
            $result[] = $result_row;
        }
    }
    return $result;
}

function explode_table2($text)
{
    return explode_table($text, 2);
}

function explode_table3($text)
{
    return explode_table($text, 3);
}

function explode_table5($text)
{
    return explode_table($text, 5);
}

function explode_list($text)
{
    global $CFG;
    $result = array();
    $sep = $CFG['AKA_SEPARATOR'];
    $cols = explode($sep, trim($text));
    foreach ($cols as $col) {
        $col = trim($col);
        if (strlen($col) > 0) {
            $result[] = $col;
        }
    }
    return $result;
}

////////////////////// MISC FUNCTIONS //////////////////////////

function get_sort_title($title)
{
    global $CFG;
    $articles = $CFG['TITLE_ARTICLES'];
    $t = strtolower($title);
    foreach ($articles as $article) {
        if (strlen($t) > strlen($article) + 1 && substr($t, 0, strlen($article) + 1) == "$article ") {
            $a = substr($title, 0, strlen($article));
            $text = substr($title, strlen($article) + 1);
            $text[0] = strtoupper($text[0]);
            return "$text, $a";
        }
    }
    return $title;
}

function get_page($url, $customHeaders = array(), $stopOnError = true)
{
    trigger_error(">>> FETCHING PAGE FROM: $url", E_USER_NOTICE);
    global $CFG;
    sleep($CFG['IMDB_PAGE_DELAY']);
    // create default headers
    $curlHeaders = array();
    foreach ($CFG['CURL_HEADERS'] as $hdr => $val) {
        $curlHeaders[] = "$hdr: $val";
    }
    // create custom headers
    foreach ($customHeaders as $hdr => $val) {
        $curlHeaders[] = "$hdr: $val";
    }
    // action
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_HTTPHEADER, $curlHeaders);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($curl, CURLOPT_AUTOREFERER, 1);
    curl_setopt($curl, CURLOPT_TIMEOUT, $CFG['CURL_TIMEOUT']);
    curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, $CFG['CURL_TIMEOUT']);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($curl, CURLOPT_COOKIESESSION, true);
    if ($CFG['CURL_PROXY'] != null) {
        curl_setopt($curl, CURLOPT_PROXY, $CFG['CURL_PROXY']);
        curl_setopt($curl, CURLOPT_PROXYTYPE, $CFG['CURL_PROXY_TYPE']);
    }
    $contents = curl_exec($curl);
    $errorMsg = curl_error($curl);
    $errorNum = curl_errno($curl);
    curl_close($curl);
    if ($contents === false) {
        if ($stopOnError == true) {
            $furl = format_default($url);
            trigger_error("CURL error ($errorNum): Could not load page from $furl): $errorMsg", E_USER_ERROR);
        } else {
            $contents = "";
        }
    }
    return $contents;
}

function random_string($length = 6)
{
    $base = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    $result = '';
    for ($i = 0; $i < $length; $i++) {
        $index = rand(0, strlen($base) - 1);
        $result .= $base[$index];
    }
    return $result;
}

// ******* CODEPAGES ***********

function utf8($string, $quote_style = ENT_NOQUOTES, $charset = "utf-8")
{
    $string = html_entity_decode($string, $quote_style, $charset);
    $string = preg_replace_callback('~&#x([0-9a-fA-F]+);~i', function ($matches) {
        return chr_utf8(hexdec($matches[1]));
    }, $string);
    //$string = preg_replace('~&#([0-9]+);~e', 'chr_utf8("\\1")', $string);
    $string = preg_replace('~&#([0-9]+);~', 'chr_utf8("\\1")', $string);
    return $string;
}

/**
* Multi-byte chr(): Will turn a numeric argument into a UTF-8 string.
*
* @param mixed $num
* @return string
*/

function chr_utf8($num)
{
    if ($num < 128) {
        return chr($num);
    }
    if ($num < 2048) {
        return chr(($num >> 6) + 192) . chr(($num & 63) + 128);
    }
    if ($num < 65536) {
        return chr(($num >> 12) + 224) . chr((($num >> 6) & 63) + 128) . chr(($num & 63) + 128);
    }
    if ($num < 2097152) {
        return chr(($num >> 18) + 240) . chr((($num >> 12) & 63) + 128) . chr((($num >> 6) & 63) + 128) . chr(($num & 63) + 128);
    }
    return '';
}

function sort_files_newest_first($path1, $path2)
{
    return filectime($path2) - filectime($path1);
}

function mark_missing_faces_for_loading($num)
{
    return query("UPDATE roles, names SET picturestatus=1 WHERE roles.num=$num AND roles.imdbid=names.imdbid AND picturestatus=2");
}

function mark_all_faces_for_loading($num)
{
    return query("UPDATE roles, names SET picturestatus=1 WHERE roles.num=$num AND roles.imdbid=names.imdbid AND picturestatus IN (0, 2)");
}

function update_actor_ratings()
{
    query("update names set score=0 where 1=1");
    return query("update names RIGHT JOIN (select roles.imdbid, names.name, ceil(sum(movies.score / (1000.0 * (roles.sort + 1.0)))) AS points from roles, movies, names where roles.num=movies.num and roles.imdbid=names.imdbid and roles.type=1 and movies.rating>=1 and movies.votes>=5 group by roles.imdbid) S ON names.imdbid=S.imdbid set names.score=S.points");
}

function update_director_ratings()
{
    query("update names set dscore=0 where 1=1");
    return query("update names RIGHT JOIN (select roles.imdbid, names.name, ceil(sum(movies.score / (1000.0 * (roles.sort + 1.0)))) AS points from roles, movies, names where roles.num=movies.num and roles.imdbid=names.imdbid and roles.type=0 and movies.rating>=1 and movies.votes>=5 and (movies.tv is null or movies.tv='') group by roles.imdbid) S ON names.imdbid=S.imdbid set names.dscore=S.points");
}

function update_actor_director_ratings()
{
    update_actor_ratings();
    update_director_ratings();
}

function get_order_by_for_field($sortField)
{
    global $CFG;
    if(isset($_GET[$sortField])) {
        $field = (int)$_GET[$sortField];
        if($field != 0) {
          $order = $CFG['ORDER_BY_FIELDS'][abs($field)];
          $order .= ($field > 0)? ' ASC': ' DESC';
          return $order;
        }
    }
    return '';
}

function get_order_by()
{
    global $CFG;
    $o1 = get_order_by_for_field('o1');
    $o2 = get_order_by_for_field('o2');
    if($o1 != '' && $o2 != '') {
        return "$o1, $o2";
    }
    else if($o1 != '') {
        return $o1;
    }
    else if($o2 != '') {
        return $o2;
    }
    else {
        return $CFG['DEFAULT_ORDER_BY'];
    }
}

function create_footer_decoration($url) {
    global $CFG;
    if(!SimpleImage::ends_with($url, '.jpg') && !SimpleImage::ends_with($url, '.jpeg')) {
        return FALSE;
    }
    $path = $CFG['LOGO_DECORATION_FOLDER'] . '/logo_' . md5($url) . '.png';
    $filename = '..' . $path;
    if(file_exists($filename)) {
      return FALSE;
    }
    $content = get_page($url, array(), FALSE);
    if($content == '') {
      return FALSE;
    }
    $fh = fopen($filename, "w");
    fwrite($fh, $content);
    fclose($fh);
    $img = new SimpleImage();
    $img->load($filename);
    $img->resizeToHeight($CFG['LOGO_DECORATION_HEIGHT']);
    $img->sharpen();
    $img->sharpen();
    $img->auto_save($filename);
    return $path;
}

function get_footer_decorations($refresh = FALSE)
{
    global $CFG;
    $now_str = strftime("%F", time());
    $ticker_query = "SELECT VAL FROM objects WHERE OBJECT='ticker' AND PROPERTY='$now_str'";
    $images = get_single_value($ticker_query);
    if ($images == null || $refresh) {
        // find new ticker images
        $files = get_decoration_image_paths('/g/l');
        $n = $CFG['TICKER_SIZE'];
        // pick random ones
        shuffle($files);
        $images = '';
        for ($i = 0; $i < $n; $i++) {
            if (strlen($images) != 0) {
                $images .= ';';
            }
            $images .= basename($files[$i]);
        }
        $images_esc = addslashes($images);
        query("DELETE FROM objects WHERE OBJECT='ticker'");
        query("INSERT INTO objects (OBJECT, PROPERTY, VAL) VALUES ('ticker', '$now_str', '$images_esc')");
    }
    return explode(';', $images);
}

function get_footer_decoration_count() {
  global $CFG;
  $path = '..' . $CFG['LOGO_DECORATION_FOLDER'];
  return count(scandir($path)) - 2;
}
