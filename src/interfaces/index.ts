interface ITorrent {
  src: string;
  link: string;
  name: string;
  size: number;
  sizeText: string;
  seeds: number;
  peers: number;
  category: string;
  enclosure_url: string;
}

interface IAddTorrentResponse {
  data: string;
  success: boolean;
}

export { IAddTorrentResponse, ITorrent };
