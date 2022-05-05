<?php

require_once("debug.php");

//echo "DB maintenance"; exit();

// create debug
$dbg = new debug();

$CFG['PAGE_TITLE'] = 'Cinema Circle 2';

// time zone
$CFG['TIME_ZONE'] = 'Europe/Belgrade';

$CFG['HD_FOLDERS'] = array('hd', 'nodvd', 'hd1', 'hd2', 'hd3', 'hd4');
$CFG['HD_FOLDERS_SQL'] = "'hd', 'nodvd', 'hd1', 'hd2', 'hd3', 'hd4'";
$CFG['SD_FOLDERS'] = array('sd', 'sd1', 'sd2', 'sd3', 'sd4');
$CFG['SD_FOLDERS_SQL'] = "'sd', 'sd1', 'sd2', 'sd3', 'sd4'";

$CFG['TICKER_SIZE'] = 15;
$CFG['THUMB_MISSING'] = 'tt__0000.png';
$CFG['RESULTS_PER_PAGE'] = 50;
$CFG['DEFAULT_THUMB_SIZE'] = 250;
$CFG['SHARPEN_FACTOR'] = 27; // bigger factor, less sharpening

$CFG['POSTER'] = 'poster';
$CFG['POSTER_TYPE'] = 'jpg';
$CFG['POSTER_ROWS'] = 10;
$CFG['POSTER_COLS'] = 25;
$CFG['POSTER_CELL_WIDTH'] = 270;
$CFG['POSTER_CELL_HEIGHT'] = 420;
$CFG['POSTER_DIR'] = 'g/p';
$CFG['POSTER_GRID_COLOR'] = '#fff';
$CFG['POSTER_BORDER_COLOR'] = '#008';
$CFG['POSTER_TEXT_SIZE'] = 5;
$CFG['POSTER_TEXT_COLOR'] = '#FFF';
$CFG['POSTER_TEXT_BGCOLOR'] = '#008';
$CFG['POSTER_TITLE'] = 'IMDB list of 250 best movies of all time. Poster created by Sasa Markovic.';
$CFG['POSTER_DATE'] = '(' . strftime('%d-%b-%Y') . ')';
// set to FALSE or null to disable poster watermaking
$CFG['POSTER_WATERMARK'] = false;
//$CFG['POSTER_WATERMARK'] = 'g/overlay.png';


$CFG['AKA_SEPARATOR'] = '|';
$CFG['AKA_SEPARATOR_2'] = "\n";
$CFG['AKA_SEPARATOR_3'] = "; ";
$CFG['RECOMMENDED_VOTES'] = 2000;
$CFG['NOT_RECOMMENDED_VOTES'] = 500;
$CFG['RECOMMENDED_RATING'] = 7;
$CFG['RECOMMENDED_ACTORS'] = 1000;
$CFG['RECOMMENDED_DIRECTORS'] = 250;
$CFG['ACTORS_TO_DIRECTORS'] = 4;
$CFG['THUMB_PREFIX'] = 'tt__';
$CFG['POSTER_PREFIX'] = 'pp__';
$CFG['ACTOR_PREFIX'] = 'aa__';

$CFG['YOUTUBE_FORMAT'] = '#[=/]?([a-zA-Z0-9-_]{11})#';

$CFG['POSTER_MIN_SIZE'] = 320 * 450;
$CFG['SMALL_POSTER_LIMIT'] = 600 * 900;
$CFG['TARGET_POSTER_DIMENSION'] = 1000;
$CFG['TARGET_POSTER_COMPRESSION'] = 80;
$CFG['UPLOADED_FILE_PERMISSIONS'] = 0664;

$CFG['IMDB_TOP250_URL'] = 'http://www.imdb.com/chart/top';

$CFG['AUTOCOMPLETE_LIMIT'] = 25;

$CFG['HD_PREFIX'] = '* ';

$CFG['RULER_TEXT'] = '----';
$CFG['RULER_DISPLAY'] = "<hr class='quotes'>";

$CFG['RELOAD_DAYS'] = 60;
$CFG['AWARDS_WON'] = array('Win', 'WIN', 'Won', 'WON', 'WINNER', 'Winner');
$CFG['AWARDS_WON_SQL'] = "'Win', 'WIN', 'Won', 'WON', 'WINNER', 'Winner'";

$CFG['BAD_LOGINS'] = array('COUNT' => 3, 'PERIOD' => 600, 'DELAY' => 5); // max 3 bad logins in 10 minutes

// TODO CLEAN VARS BELOW THIS POINT
$CFG['MOVIE_STARS'] = 5; // number of top movie stars
$CFG['ACTOR_TRESHOLD'] = 1; // minimum number of credited roles before actor image is fetched
$CFG['SHOW_ACTOR_BIOS'] = true; // should we show biography automatically on name search results page
$CFG['IMDB_DAILY_CHECK'] = false;
$CFG['IMDB_PARSER_CHECK_URL'] = 'https://www.imdb.com/title/tt0361862'; // The Machinist
$CFG['IMDB_NAME_IMAGE_CHECK_ID'] = '0000288'; // Christian Bale

$CFG['CODE_PAGE'] = array('apache' => 'utf-8', 'html' => 'utf-8', 'mysql' => 'utf8');

$CFG['COUNTRIES'] = array(
    "ad" => "Andorra",
    "ae" => "United Arab Emirates",
    "af" => "Afghanistan",
    "ag" => "Antigua and Barbuda",
    "ai" => "Anguilla",
    "al" => "Albania",
    "am" => "Armenia",
    "an" => "Netherlands Antilles",
    "ao" => "Angola",
    "aq" => "Antarctica",
    "ar" => "Argentina",
    "as" => "American Samoa",
    "at" => "Austria",
    "au" => "Australia",
    "aw" => "Aruba",
    "ax" => "Åland Islands",
    "az" => "Azerbaijan",
    "ba" => "Bosnia and Herzegovina",
    "bb" => "Barbados",
    "bd" => "Bangladesh",
    "be" => "Belgium",
    "bf" => "Burkina Faso",
    "bg" => "Bulgaria",
    "bh" => "Bahrain",
    "bi" => "Burundi",
    "bj" => "Benin",
    "bl" => "Saint Barthélemy",
    "bm" => "Bermuda",
    "bn" => "Brunei Darussalam",
    "bo" => "Bolivia",
    "br" => "Brazil",
    "bs" => "Bahamas",
    "bt" => "Bhutan",
    "bv" => "Bouvet Island",
    "bw" => "Botswana",
    "by" => "Belarus",
    "bz" => "Belize",
    "ca" => "Canada",
    "cc" => "Cocos Islands",
    "cd" => "The Democratic Republic of Congo",
    "cf" => "Central African Republic",
    "cg" => "Congo",
    "ch" => "Switzerland",
    "ci" => "Côte d'Ivoire",
    "ck" => "Cook Islands",
    "cl" => "Chile",
    "cm" => "Cameroon",
    "cn" => "China",
    "co" => "Colombia",
    "cr" => "Costa Rica",
    "cu" => "Cuba",
    "cv" => "Cape Verde",
    "cw" => "Curaçao",
    "cx" => "Christmas Island",
    "cy" => "Cyprus",
    "cz" => "Czech Republic",
    "de" => "Germany",
    "dj" => "Djibouti",
    "dk" => "Denmark",
    "dm" => "Dominica",
    "do" => "Dominican Republic",
    "dz" => "Algeria",
    "ec" => "Ecuador",
    "ee" => "Estonia",
    "eg" => "Egypt",
    "eh" => "Western Sahara",
    "er" => "Eritrea",
    "es" => "Spain",
    "et" => "Ethiopia",
    "fi" => "Finland",
    "fj" => "Fiji",
    "fk" => "Falkland Islands",
    "fm" => "Micronesia",
    "fo" => "Faroe Islands",
    "fr" => "France",
    "ga" => "Gabon",
    "gb" => "United Kingdom",
    "gd" => "Grenada",
    "ge" => "Georgia",
    "gf" => "French Guiana",
    "gg" => "Guernsey",
    "gh" => "Ghana",
    "gi" => "Gibraltar",
    "gl" => "Greenland",
    "gm" => "Gambia",
    "gn" => "Guinea",
    "gp" => "Guadeloupe",
    "gq" => "Equatorial Guinea",
    "gr" => "Greece",
    "gs" => "South Georgia and the South Sandwich Islands",
    "gt" => "Guatemala",
    "gu" => "Guam",
    "gw" => "Guinea-Bissau",
    "gy" => "Guyana",
    "hk" => "Hong Kong",
    "hm" => "Heard Island and McDonald Islands",
    "hn" => "Honduras",
    "hr" => "Croatia",
    "ht" => "Haiti",
    "hu" => "Hungary",
    "id" => "Indonesia",
    "ie" => "Ireland",
    "il" => "Israel",
    "im" => "Isle of Man",
    "in" => "India",
    "io" => "British Indian Ocean Territory",
    "iq" => "Iraq",
    "ir" => "Iran",
    "is" => "Iceland",
    "it" => "Italy",
    "je" => "Jersey",
    "jm" => "Jamaica",
    "jo" => "Jordan",
    "jp" => "Japan",
    "ke" => "Kenya",
    "kg" => "Kyrgyzstan",
    "kh" => "Cambodia",
    "ki" => "Kiribati",
    "km" => "Comoros",
    "kn" => "Saint Kitts and Nevis",
    "kp" => "North Korea",
    "kr" => "South Korea",
    "kw" => "Kuwait",
    "ky" => "Cayman Islands",
    "kz" => "Kazakhstan",
    "la" => "Laos",
    "lb" => "Lebanon",
    "lc" => "Saint Lucia",
    "li" => "Liechtenstein",
    "lk" => "Sri Lanka",
    "lr" => "Liberia",
    "ls" => "Lesotho",
    "lt" => "Lithuania",
    "lu" => "Luxembourg",
    "lv" => "Latvia",
    "ly" => "Libya",
    "ma" => "Morocco",
    "mc" => "Monaco",
    "md" => "Moldova",
    "me" => "Montenegro",
    "mg" => "Madagascar",
    "mh" => "Marshall Islands",
    "mk" => "Republic of North Macedonia",
    "ml" => "Mali",
    "mm" => "Myanmar",
    "mn" => "Mongolia",
    "mo" => "Macao",
    "mp" => "Northern Mariana Islands",
    "mq" => "Martinique",
    "mr" => "Mauritania",
    "ms" => "Montserrat",
    "mt" => "Malta",
    "mu" => "Mauritius",
    "mv" => "Maldives",
    "mw" => "Malawi",
    "mx" => "Mexico",
    "my" => "Malaysia",
    "mz" => "Mozambique",
    "na" => "Namibia",
    "nc" => "New Caledonia",
    "ne" => "Niger",
    "nf" => "Norfolk Island",
    "ng" => "Nigeria",
    "ni" => "Nicaragua",
    "nl" => "Netherlands",
    "no" => "Norway",
    "np" => "Nepal",
    "nr" => "Nauru",
    "nu" => "Niue",
    "nz" => "New Zealand",
    "om" => "Oman",
    "pa" => "Panama",
    "pe" => "Peru",
    "pf" => "French Polynesia",
    "pg" => "Papua New Guinea",
    "ph" => "Philippines",
    "pk" => "Pakistan",
    "pl" => "Poland",
    "pm" => "Saint Pierre and Miquelon",
    "pn" => "Pitcairn",
    "pr" => "Puerto Rico",
    "ps" => "Palestine",
    "pt" => "Portugal",
    "pw" => "Palau",
    "py" => "Paraguay",
    "qa" => "Qatar",
    "re" => "Réunion",
    "ro" => "Romania",
    "rs" => "Serbia",
    "ru" => "Russia",
    "rw" => "Rwanda",
    "sa" => "Saudi Arabia",
    "sb" => "Solomon Islands",
    "sc" => "Seychelles",
    "sd" => "Sudan",
    "se" => "Sweden",
    "sg" => "Singapore",
    "sh" => "Saint Helena",
    "si" => "Slovenia",
    "sj" => "Svalbard and Jan Mayen",
    "sk" => "Slovakia",
    "sl" => "Sierra Leone",
    "sm" => "San Marino",
    "sn" => "Senegal",
    "so" => "Somalia",
    "sr" => "Suriname",
    "ss" => "South Sudan",
    "st" => "Sao Tome and Principe",
    "sv" => "El Salvador",
    "sx" => "Sint Maarten (Dutch Part)",
    "sy" => "Syria",
    "sz" => "Swaziland",
    "tc" => "Turks And Caicos Islands",
    "td" => "Chad",
    "tf" => "French Southern Territories",
    "tg" => "Togo",
    "th" => "Thailand",
    "tj" => "Tajikistan",
    "tk" => "Tokelau",
    "tl" => "Timor-Leste",
    "tm" => "Turkmenistan",
    "tn" => "Tunisia",
    "to" => "Tonga",
    "tr" => "Turkey",
    "tt" => "Trinidad And Tobago",
    "tv" => "Tuvalu",
    "tw" => "Taiwan",
    "tz" => "Tanzania",
    "ua" => "Ukraine",
    "ug" => "Uganda",
    "um" => "United States Minor Outlying Islands",
    "us" => "USA",
    "uy" => "Uruguay",
    "uz" => "Uzbekistan",
    "va" => "Holy See (Vatican City State)",
    "vc" => "Saint Vincent and Thegrenadines",
    "ve" => "Venezuela",
    "vg" => "British Virgin Islands",
    "vi" => "U.S. Virgin Islands",
    "vn" => "Vietnam",
    "vu" => "Vanuatu",
    "wf" => "Wallis and Futuna",
    "ws" => "Samoa",
    "ye" => "Yemen",
    "yt" => "Mayotte",
    "za" => "South Africa",
    "zm" => "Zambia",
    "zw" => "Zimbabwe",
    "yucs" => "Federal Republic of Yugoslavia",
    "cshh" => "Czechoslovakia",
    "xwg" => "West Germany",
    "xyu" => "Yugoslavia",
    "csxx" => "Serbia and Montenegro",
    "suhh" => "Soviet Union",
    "ddde" => "East Germany"
);

$CFG['TITLE_ARTICLES'] = array('the', 'a', 'an', 'der', 'des', 'dem', 'den', 'die', 'das', 'le', 'les', 'la', 'il', 'el', 'en');

$CFG['CURL_PROXY'] = null;
//$CFG['CURL_PROXY'] = "179.124.140.41:42423";
//$CFG['CURL_PROXY_TYPE'] = CURLPROXY_SOCKS4;
$CFG['CURL_HEADERS'] = array(
  "Forwarded" => "for=170.171.1.100",
  "X-Forwarded-For" => "170.171.1.100",
  "Accept" => "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language" => "en-US,en",
  "Accept-Charset" => "utf-8;q=1.0,*;q=0.2",
  "User-Agent" => "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0"
);
$CFG['CURL_TIMEOUT'] = 60;
$CFG['IMDB_PAGE_DELAY'] = 2; // seconds

$CFG['RSS_FEEDS'] = array(
    array('file' => 'movieweb.xml', 'name' => 'Movieweb News')
    //array('file' => 'lwlies.xml', 'name' => 'Little White Lies News')
);

$CFG['ORDER_BY_FIELDS'] = array(
  '', 'm.id', 't.title', 'm.year', 'm.rating', 'm.votes', 'm.score', 'm.metascore', 'm.views', 'm.dateadd'
);
$CFG['DEFAULT_ORDER_BY'] = 'm.id DESC';

$CFG['BUG_MONTHS'] = 6; // Look six months into the past

// update actor/director points on every 10 movies
$CFG['UPDATE_RATINGS_FREQUENCY'] = 10;

// logo decoration FOLDER
$CFG['LOGO_DECORATION_FOLDER'] = '/g/l';
$CFG['LOGO_DECORATION_HEIGHT'] = 54;

// secrets cipher algorithm
$CFG['SECRETS_CIPHER'] = 'aes-128-gcm';

// LOAD CUSTOM SETTINGS
$host = strtolower($_SERVER['SERVER_NAME']);
if (substr($host, 0, 4) == 'www.') {
    $host = substr($host, 4);
}
$conf = "conf-$host.php";
if (!@include($conf)) {
    include("conf-localhost.php");
}
