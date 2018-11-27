<?php
class ThePirateBay {
    private $url = 'https://thepiratebay.org';

    /*
       * Search()
       * @param {string} $keyword
       */
    public function search($keyword){
        $page = 0;
        $keyword = rawurlencode(utf8_encode($keyword));

        $searchUrl = $this->url . "/search/$keyword/$page/99/0";
        $body = file_get_contents($searchUrl);
        return $this->get_page_results($body);

    }

    private function get_page_results($body) {
        $found = [];

         // This use to work. It changed?
         preg_match_all(
            "`<tr.*" .
            ".*<td.*<center.*<a.*>(?P<category>.*)</a>.*</td>.*" .
            ".*<td.*<div.*<a href=\"(?P<descriptionLink>.*)\".*>(?P<name>.*)</a>.*" .
            ".*<a href=\"(?P<link>magnet:.*)\".*</a>.*" .
            ".*<font.*>Uploaded (?P<time>.*), Size (?P<size>.*)&nbsp;(?P<unit>[a-zA-Z]*),.*</font>.*" .
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
            $tlink->src = "thepiratebay.org";
            $tlink->link = $result["link"][$i];
            $tlink->name = strip_tags($result["name"][$i]);
            $tlink->size = ($result["size"][$i] + 0) * unit_size($result["unit"][$i]);
            $tlink->sizeText = $result["size"][$i] . $result["unit"][$i];
            $tlink->seeds = $result["seeds"][$i] + 0;
            $tlink->peers = $result["leechers"][$i] + 0;
            $tlink->category = $result["category"][$i];
            $tlink->enclosure_url = $tlink->link;

            $found [] = $tlink;
        }

        return $found;
    }
}