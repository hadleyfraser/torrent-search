<?php
function pr($arr) {
    echo '<pre>';
    print_r($arr);
    exit;
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
    die(json_encode(['success' => $success, 'data' => $data]));
}
