<?php

class ThePirateBay {
    // private $url = 'https://baypirateproxy.org';
    private $url = 'https://proxtpb.art';

    /*
       * Search()
       * @param {string} $keyword
       */
    public function search($keyword){
        $page = 0;
        $keyword = urlencode($keyword);

        $limit = 50;
        $results = [];

        do {
            $searchUrl = sprintf('%s/s/?q=%s&page=%s&orderby=99', $this->url, $keyword, $page);
            $body = file_get_contents($searchUrl);
            $pageResults = $this->get_page_results($body);
            if ($pageResults && count($pageResults)) {
                $results = array_merge($results, $pageResults);
            }
            $page++;
        }
        while ($pageResults && count($pageResults) && count($results) < $limit);

        return $results;
    }

    private function get_page_results($body) {
        $found = [];

         preg_match_all(
            "`<tr.*<td.*<center.*<a.*>(?P<category>.*)</a>.*</td>.*" .
            ".*<td.*<div.*<a href=\"(?P<link>.*)\".*>(?P<name>.*)</a>.*" .
            ".*<font.*>Uploaded (?P<time>.*), Size (?P<size>.*)(?P<unit>[a-zA-Z]*),.*</font>.*" .
            ".*<td.*>(?P<seeds>\d+)</td>.*" .
            ".*<td.*>(?P<leechers>\d+)</td>.*" .
            ".*</tr.*`siU",
            $body,
            $result
        );

        if (!$result || ($len = count($result["name"])) == 0) {
            return false;
        }

        for ($i = 0; $i < $len; ++$i) {
            $tlink = new stdClass();

            $tlink->src = "piratebay";
            $tlink->link = $this->url . $result["link"][$i];
            $tlink->name = strip_tags($result["name"][$i]);
            $tlink->size = ($result["size"][$i] + 0) * unit_size($result["unit"][$i]);
            $tlink->sizeText = preg_replace('/[^\d+\.]/', '', $result["size"][$i]) . $result["unit"][$i];
            $tlink->seeds = $result["seeds"][$i] + 0;
            $tlink->peers = $result["leechers"][$i] + 0;
            $tlink->category = $result["category"][$i];
            $tlink->enclosure_url = $tlink->link;

            $found [] = $tlink;
        }

        return $found;
    }

    public function get_download_link($url) {
        $body = file_get_contents($url);
        preg_match(
            "`" .
            "<div.*class=\"download\".*" .
            ".*<a.*href=\"(?P<link>magnet:.*)\"" .
            "`siU",
            $body,
            $result
        );
        return $result['link'];
    }
}