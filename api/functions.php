<?php
include 'classes/ThePiratebay.php';
include 'classes/Leekx.php';
include 'classes/Kickass.php';
include 'classes/DownloadStation.php';

function pr($arr, $exit = true) {
    echo '<pre>';
    print_r($arr);
    if ($exit) {
        exit;
    }
}

/*
* unit_size()
* @param {string} $unit
* @return {number} sizeof byte
*/
function unit_size($unit) {
    switch ($unit) {
        case "KiB": return 1000;
        case "MiB": return 1000000;
        case "GiB": return 1000000000;
        case "TiB": return 1000000000000;
        default: return 1;
    }
}

/**
 * @param [] $data
 * @param bool $success
 */
function json_die($data, $success = true) {
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    die(json_encode(['success' => $success, 'data' => $data]));
}

function search($search, $site, $dev) {
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
                sleep(1);
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
}

function download($url, $site, $type, $dev) {
    if ($dev) {
        json_die('Torrent Added');
    }

    if ($site === '1337x') {
        $leekx = new Leekx();
        $url = $leekx->get_download_link($url);
    }

    $ds = new DownloadStation();
    $ds->addTorrent($url, $type);
}