<?php
include 'functions.php';
include 'classes/thepiratebay.php';
include 'classes/leekx.php';

header('Access-Control-Allow-Origin: *');

$pirateBay = new ThePirateBay();
$leekx = new Leekx();

$action = $_REQUEST['action'];
$search = $_REQUEST['search'];
$url = $_REQUEST['url'];

if ($action === 'search') {

    include './dummy-output.php';
    json_die($data);
    exit;


    $found = $pirateBay->search($search);
    $found = array_merge($leekx->search('the flash'), $found);
    usort($found, function ($a, $b) {
        return $a->seeds > $b->seeds ? -1 : 1;
    });
    var_export($found);exit;
    json_die($found);
} else if ($action === 'download' && $url) {
    json_die('magnet:some-link-to-somewhere');
    
    
    json_die($leekx->get_download_link($url));
}
json_die('', false);
