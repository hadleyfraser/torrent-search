<?php
class Leekx {
    private $url = 'https://1337x.to';

    /*
       * Search()
       * @param {string} $keyword
       */
      public function search($keyword) {
        $page = 1;
        $keyword = urlencode($keyword);

        $limit = 50;
        $results = [];

        do {
            $searchUrl = sprintf('%s/search/%s/%s/', $this->url, $keyword, $page);
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

        // This use to work. It changed?
        preg_match_all(
            "`".
            "<tr>.*".
            "<td class=\"coll-1 name\">.*".
            "<i class=\"flaticon-(?P<category>[^\"]+)\">.*".
            "<a href=\"(?P<link>/torrent/[^\"]+)\">(?P<name>.*)</a>.*".
            "</td>.*".
            "<td class=\"coll-2 seeds\">(?P<seeds>\d+)</td>.*".
            "<td class=\"coll-3 leeches\">(?P<leechers>\d+)</td>.*".
            "<td class=\"coll-date\">(?P<time>.*)</td>.*".
            "<td class=\"coll-4 size mob-(uploader|vip)\">(?P<size>[^ ]+) +(?P<unit>[a-zA-Z]*)<span.*</span></td>.*".
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

            $tlink->src = "leeks";
            $tlink->link = $this->url . $result["link"][$i];
            $tlink->name = strip_tags($result["name"][$i]);
            $tlink->size = ($result["size"][$i] + 0) * unit_size($result["unit"][$i]);
            $tlink->sizeText = $result["size"][$i] . $result["unit"][$i];
            $tlink->seeds = $result["seeds"][$i] + 0;
            $tlink->peers = $result["leechers"][$i] + 0;
            $tlink->category = strtolower($result["category"][$i]);
            $tlink->enclosure_url = $tlink->link;

            $found [] = $tlink;
        }

        return $found;
    }

    public function get_download_link($url) {
        $body = file_get_contents($url);
        preg_match(
            "`" .
            "<ul.*download-links.*" .
            "<a.*href=\"(?P<link>magnet:.*)\"" .
            "`siU",
            $body,
            $result
        );
        return $result['link'];
    }
}