<?php
class Kickass {
    private $url = 'https://kickassz.com';

    /*
       * Search()
       * @param {string} $keyword
       */
    public function search($keyword){
        $page = 0;
        $keyword = urlencode($keyword);

        $searchUrl = $this->url . "/usearch/$keyword/?field=seeders&sorder=desc";
        $body = file_get_contents($searchUrl);
        return $this->get_page_results($body);
    }

    private function get_page_results($body) {
        $found = [];

        // This use to work. It changed?
        preg_match_all(
            "`".
              "<tr .+ id=\"torrent_latest_torrents\">.*".
                "<a .+ title=\"Torrent magnet link\" href=\"[^\"]+url=(?P<magnet>[^\"]+)\".*</a>.*".
                "<a href=\"(?P<link>[^\"]+)\" class=\"cellMainLink\">(?P<name>.*)</a>.*".
                "in <span.*><strong><a.*>(?P<category>.*)</a></strong></span>.*".
                "<td class=\"nobr center\">(?P<size>[^ ]+) +(?P<unit>[a-zA-Z]*)</span></td>.*".
                "<td class=\"center\" title=\"[^\"]+\">(?P<time>.*)</td>.*".
                "<td class=\"green center\">(?P<seeds>\d+)</td>.*".
                "<td class=\"red lasttd center\">(?P<leechers>\d+)</td>.*".
              "</tr>".
            "`siU",
            $body,
            $result
        );
        
        if (!$result || ($len = count($result["name"])) == 0) {
            return false;
        }

        for ($i = 0; $i < $len; ++$i) {
            $tlink = new stdClass();

            $tlink->src = "Kickass";
            $tlink->link = urldecode(urldecode($result["magnet"][$i]));
            $tlink->name = $result["name"][$i];
            $tlink->size = ($result["size"][$i] + 0) * unit_size($result["unit"][$i]);
            $tlink->sizeText = $result["size"][$i] . $result["unit"][$i];
            $tlink->seeds = $result["seeds"][$i] + 0;
            $tlink->peers = $result["leechers"][$i] + 0;
            $tlink->category = strtolower($result["category"][$i]);
            $tlink->enclosure_url = urldecode(urldecode($result["magnet"][$i]));

            $found [] = $tlink;
        }

        return $found;
    }
}