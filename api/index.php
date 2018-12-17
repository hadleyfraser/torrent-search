<?php
include 'functions.php';

$action = $_REQUEST['action'];
$search = $_REQUEST['search'];
$site = $_REQUEST['site'];
$url = $_REQUEST['url'];
$type = $_REQUEST['type'];
$dev = $_REQUEST['dev'] == 'true';

if ($dev) {
    sleep(1);
}
if ($action === 'search') {
    search($search, $site, $dev);
} else if ($action === 'download' && $url) {
    download($url, $site, $type, $dev);
} else if($action === 'download-list') {
    downloadList();
}
json_die('', false);
