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

function get_site_object($site) {
    switch($site) {
        case 'piratebay':
            return new ThePirateBay();
        case 'leeks':
            return new Leekx();
        case 'kickass':
            return new Kickass();
    }
}

function output_dev_search($site) {
    switch($site) {
        case 'piratebay':
            include 'stub/piratebay.php';
            json_die($data);
        case 'leeks':
            sleep(1);
            include 'stub/leeks.php';
            json_die($data);
        case 'kickass':
            sleep(2);
            include 'stub/kickass.php';
            json_die($data);
    }
}

function search($search, $site, $dev) {
    if ($dev) {
        output_dev_search($site);
    }

    $siteSearch = get_site_object($site);
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

    if (strpos($url, 'magnet') === false) {
        $siteSearch = get_site_object($site);
        if (!$siteSearch) {
            json_die('No ' . $site . ' class found', false);
        }

        // hide any error messages
        ob_start();
        $downloadUrl = $siteSearch->get_download_link($url);
        ob_end_clean();

        if (!$downloadUrl) {
            json_die('No Torrent URL Found at url: ' . $url, false);
        }
        $url = $downloadUrl;
    }

    $ds = new DownloadStation();
    $ds->addTorrent($url, $type);
}

function downloadList($dev) {
    if ($dev) {
        sleep(2);
        $downloadList = json_decode(file_get_contents(__DIR__ . '/stub/download-list.json'));
        json_die($downloadList);
    }

    $ds = new DownloadStation();
    $ds->getTorrentList();
}

function clearCompleteTorrents($dev) {
    if ($dev) {
        sleep(1);
        $downloadList = json_decode(file_get_contents(__DIR__ . '/stub/download-list.json'));
        $downloadList->data = [$downloadList->data[0]];
        json_die($downloadList);
    }

    $ds = new DownloadStation();
    $ds->clearCompleteTorrents();
}

function changeTorrentStatus($hash, $isPaused, $dev) {
    if ($dev) {
        $downloadList = json_decode(file_get_contents(__DIR__ . '/stub/download-list.json'));
        $downloadList->data[0]->state = $isPaused ? 104 : 1;
        json_die($downloadList);
    }

    $ds = new DownloadStation();
    $ds->changeTorrentStatus($hash, $isPaused);
}

function forceDeleteTorrent($hash, $dev) {
    if ($dev) {
        $downloadList = json_decode(file_get_contents(__DIR__ . '/stub/download-list.json'));
        array_pop($downloadList->data);
        json_die($downloadList);
    }

    $ds = new DownloadStation();
    $ds->forceDeleteTorrent($hash);
}