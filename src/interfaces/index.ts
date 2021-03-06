interface ISiteSetting {
  active: boolean;
  name: string;
  title: string;
}

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

interface ISearchResponse {
  data: ITorrent[];
  search: string;
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

enum EStatus {
  ADDING,
  ERROR,
  SUCCESS
}

type ITorrentWithStatus = ITorrent & {
  status?: EStatus;
};

export {
  EStatus,
  IAddTorrentResponse,
  IDownload,
  ISearchResponse,
  ISiteSetting,
  ITorrentWithStatus,
  ITorrent,
  ITorrentListResponse
};
