<?php
$env = json_decode(file_get_contents(__DIR__ . '/env.json'));

class DownloadStation {
  private $username;
  private $password;
  private $loginEndpoint;
  private $logoutEndpoint;
  private $addTorrentEndpoint;

  private $sid;

  public function __construct() {
    global $env;
    $this->username = $env->username;
    $this->password = base64_encode($env->password);
    $this->loginEndpoint = sprintf('%s/%s', $env->baseUrl, $env->login);
    $this->logoutEndpoint = sprintf('%s/%s', $env->baseUrl, $env->logout);
    $this->addTorrentEndpoint = sprintf('%s/%s', $env->baseUrl, $env->add);
    $this->getListEndpoint = sprintf('%s/%s', $env->baseUrl, $env->getList);
    $this->removeTorrentEndpoint = sprintf('%s/%s', $env->baseUrl, $env->removeTorrent);
    $this->pauseTorrentEndpoint = sprintf('%s/%s', $env->baseUrl, $env->pauseTorrent);
    $this->startTorrentEndpoint = sprintf('%s/%s', $env->baseUrl, $env->startTorrent);
  }

  private function make_call($url, $requestType = 'GET') {
    $curl = curl_init();

    curl_setopt_array($curl, array(
      CURLOPT_PORT => "8080",
      CURLOPT_URL => $url,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => "",
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 30,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => $requestType,
      CURLOPT_POSTFIELDS => "",
    ));

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
      json_die([
        'Error Type' => 'cURL failed',
        'URL' => $url,
        'error' => $err
      ], false);
    }
    return json_decode($response);
  }

  public function addTorrent($url, $type) {
    $this->dsLogin();
    $this->dsAddTorrent($url, $type);
    $this->dsLogout();
    json_die('Torrent Added');
  }

  public function getTorrentList() {
    $this->dsLogin();
    $torrentList = $this->dsGetTorrentList();
    $this->dsLogout();
    json_die($torrentList);
  }

  public function clearCompleteTorrents() {
    $this->dsLogin();
    $torrentList = $this->dsGetTorrentList();
    $torrentsToRemove = [];
    foreach($torrentList->data as $torrent) {
      if ($torrent->state === 100 || $torrent->progress === 100) {
        $torrentsToRemove[] = $torrent->hash;
      }
    }
    $this->dsRemoveMultipleTorrents($torrentsToRemove);
    $torrentList = $this->dsGetTorrentList();
    $this->dsLogout();
    json_die($torrentList);
  }

  public function changeTorrentStatus($hash, $isPaused) {
    $this->dsLogin();
    if (!$isPaused) {
      $this->dsPauseTorrent($hash);
    } else {
      $this->dsStartTorrent($hash);
    }
    $torrentList = $this->dsGetTorrentList();
    $this->dsLogout();
    json_die($torrentList);
  }

  private function dsAddTorrent($torrentUrl, $type) {
    $url = sprintf($this->addTorrentEndpoint, $type, urlencode($torrentUrl), $this->sid);
    $added = $this->make_call($url, 'POST');
    if (!$added) {
      json_die('The response could not be decoded', false);
    }
    $error = $added->error;
    if ($error) {
      json_die(sprintf('Error Adding Torrent: %d', $error), false);
    }
  }

  private function dsLogout() {
    $url = sprintf($this->logoutEndpoint, $this->sid);
    $logout = $this->make_call($url);
  }

  private function dsLogin() {
    $url = sprintf($this->loginEndpoint, $this->username, $this->password);
    $login = $this->make_call($url);
    $error = $login->error;
    if ($error) {
      if ($error === 4) {
        json_die('Failed to login', false);
      }
      json_die(sprintf('Unknown Error: %d', $error), false);
    }
    $this->sid = $login->sid;
  }

  private function dsGetTorrentList() {
    $url = sprintf($this->getListEndpoint, $this->sid);
    $list = $this->make_call($url);
    if (!$list) {
      json_die('The response could not be decoded', false);
    }
    $error = $list->error;
    if ($error) {
      json_die(sprintf('Error Retrieving Torrent List: %d', $error), false);
    }

    return $list;
  }

  private function dsPauseTorrent($hash) {
    $url = sprintf($this->pauseTorrentEndpoint, $this->sid, $hash);
    $paused = $this->make_call($url);
    if ($paused->error) {
      json_die(sprintf('Error Pausing Torrent: %d', $error), false);
    }
  }

  private function dsStartTorrent($hash) {
    $url = sprintf($this->startTorrentEndpoint, $this->sid, $hash);
    $started = $this->make_call($url);
    if ($started->error) {
      json_die(sprintf('Error Starting Torrent: %d', $error), false);
    }
  }

  private function dsRemoveTorrent($hash) {
    $url = sprintf($this->removeTorrentEndpoint, $this->sid, $hash);
    $removed = $this->make_call($url);
  }

  private function dsRemoveMultipleTorrents($hashList) {
    $url = sprintf($this->removeTorrentEndpoint, $this->sid, implode('&hash=', $hashList));
    $removed = $this->make_call($url);
  }
}