<?php
include 'functions.php';
include 'classes/thepiratebay.php';
include 'classes/leekx.php';
include 'classes/kickass.php';

$action = $_REQUEST['action'];
$search = $_REQUEST['search'];
$site = $_REQUEST['site'];
$url = $_REQUEST['url'];
$dev = $_REQUEST['dev'] == 'true';

if ($dev) {
    sleep(2);
}
if ($action === 'search') {
    switch($site) {
        case 'piratebay':
            if ($dev) {
                include 'stub/piratebay.php';
                json_die($data);
            }
            $siteSearch = new ThePirateBay();
            break;
        case 'leeks':
            if ($dev) {
                sleep(2);
                include 'stub/leeks.php';
                json_die($data);
            }
            $siteSearch = new Leekx();
            break;
        case 'kickass':
            if ($dev) {
                sleep(2);
                include 'stub/kickass.php';
                json_die($data);
            }
            $siteSearch = new Kickass();
            break;
    }
    if (!$siteSearch) {
        json_die(false, false);
    }
    try {
        json_die($siteSearch->search($search));
    } catch(Exception $e) {
        json_die(false, false);
    }
} else if ($action === 'download' && $url) {
    if ($dev) {
        json_die('download-link');
    }

    $leekx = new Leekx();
    json_die($leekx->get_download_link($url));
}
json_die('', false);
