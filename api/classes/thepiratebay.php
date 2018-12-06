<?php
// Regex needs to be fixed

/*
    <tr><td class="vertTh">
			<center>
				<a href="/browse/200" title="More from this category">Video</a><br>
				(<a href="/browse/205" title="More from this category">TV shows</a>)
			</center>
		</td>
		<td>
<div class="detName">			<a href="/torrent/26971323/Supergirl.S04E08.HDTV.x264-SVA" class="detLink" title="Details for Supergirl.S04E08.HDTV.x264-SVA">Supergirl.S04E08.HDTV.x264-SVA</a>
</div>
<a href="/torrent/26971323/Supergirl.S04E08.HDTV.x264-SVA" title="Download this torrent using magnet"><img src="/static/img/icon-magnet.gif" alt="Magnet link"></a><a href="http://www.bitlord.me/share/?re=ThePirateBay&amp;ba=b8977e&amp;co=fff&amp;sh=gtekJiHbEKtBfc5vJkzxe7gtfbs=&amp;ur=/search/Supergirl%20S04E08/0/99/0&amp;fn=Supergirl.S04E08.HDTV.x264-SVA" target="_blank" title="Play now using Bitlord"><img src="/static/img/icons/icon-bitx.png" alt="Play link"></a><img src="/static/img/11x11p.png"><img src="/static/img/11x11p.png"><font class="detDesc">Uploaded 12-03&nbsp;03:29, Size 282.24&nbsp;MiB, ULed by <a class="detDesc" href="/user/sotnikam/" title="Browse sotnikam">sotnikam</a></font>
		</td>
		<td align="right">425</td>
		<td align="right">31</td>
	</tr>
*/


class ThePirateBay {
    private $url = 'https://baypirateproxy.org/';

    /*
       * Search()
       * @param {string} $keyword
       */
    public function search($keyword){
        $page = 0;
        $keyword = rawurlencode(utf8_encode($keyword));

        $searchUrl = $this->url . "/search/$keyword/$page/99/0";
        $body = file_get_contents($searchUrl);
        echo $body;exit;
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