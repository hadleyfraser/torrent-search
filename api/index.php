<?php
include 'functions.php';

$action = $_REQUEST['action'];
$search = $_REQUEST['search'];
$site = $_REQUEST['site'];
$url = $_REQUEST['url'];
$type = $_REQUEST['type'];
$hash = $_REQUEST['hash'];
$isPaused = $_REQUEST['isPaused'] === "true";
$dev = $_REQUEST['dev'] == 'true';

if ($dev) {
    sleep(1);
}
switch($action) {
    case 'search':
        search($search, $site, $dev);
        break;
    case 'download':
        if ($url) {
            download($url, $site, $type, $dev);
        }
        break;
    case 'download-list':
        downloadList($dev);
        break;
    case 'clear-completed':
        clearCompleteTorrents($dev);
       break;
    case 'change-status':
        changeTorrentStatus($hash, $isPaused, $dev);
    break;
}

json_die('', false);
