interface IResponse {
  success: boolean;
}

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

type IAddTorrentResponse = IResponse & {
  data: string;
  success: boolean;
};

interface IDownload {
  down_rate: number;
  error: number;
  eta: number;
  hash: string;
  peers: number;
  progress: number;
  seeds: number;
  size: number;
  source: string;
  state: number;
}

type ITorrentListResponse = IResponse & {
  data: {
    data: IDownload[];
  };
};

export { IAddTorrentResponse, IDownload, ITorrent, ITorrentListResponse };
