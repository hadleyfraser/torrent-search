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

  private function dsAddTorrent($torrentUrl, $type) {
    $url = sprintf($this->addTorrentEndpoint, $type, urlencode($torrentUrl), $this->sid);
    $added = $this->make_call($url, 'POST');
    if (!$added) {
      json_die('The response could not be decoded', false);
    }
    $error = $added->error;
    if ($error) {
      json_die(sprintf('Error Adding Torrent: %d', $error));
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
      json_die(sprintf('Unknown Error: %d', $error));
    }
    $this->sid = $login->sid;
  }
}