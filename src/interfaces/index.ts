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
  success: boolean;
}

interface IDownloadResponse {
  data: string;
  success: boolean;
}

export { IDownloadResponse, ISearchResponse };
