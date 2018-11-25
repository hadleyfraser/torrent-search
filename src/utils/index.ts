import axios from "axios";
import { IDownloadResponse, ISearchResponse } from "src/interfaces";

const baseUrl = "http://localhost/torrent-search/api?action=";
const searchUrl = `${baseUrl}search&search=`;
const torrentUrl = `${baseUrl}download&url=`;

const search = async (search: string): Promise<ISearchResponse> => {
  if (search) {
    const response = await axios.get(`${searchUrl}${search}`);
    return response.data;
  } else {
    throw new Error("Search Term Missing");
  }
};

const get_download_url = async (url: string): Promise<IDownloadResponse> => {
  if (url) {
    const response = await axios.get(`${torrentUrl}${url}`);
    return response.data;
  } else {
    throw new Error("Torrent URL Missing");
  }
};

export { get_download_url, search };
