import axios from "axios";
import {
  IAddTorrentResponse,
  IDownload,
  ITorrent,
  ITorrentListResponse
} from "src/interfaces";
import { taskStatus } from "src/constants";

const inDev = process.env.NODE_ENV === "development";

const ipApi = "http://ip-api.com/json";
const baseUrl = `http://localhost/torrent-search${inDev ? "-src" : ""}/api/?${
  inDev ? "dev=true&" : ""
}action=`;
const searchUrl = `${baseUrl}search&search=`;
const torrentUrl = `${baseUrl}download&url={url}&site={site}&type={type}`;
const torrentListUrl = `${baseUrl}download-list`;
const clearTorrentListUrl = `${baseUrl}clear-completed`;
const changeStatusUrl = `${baseUrl}change-status&hash={hash}&isPaused={status}`;

const addTorrent = async (
  torrent: ITorrent,
  type: string
): Promise<IAddTorrentResponse> => {
  if (torrent.link) {
    const response = await axios.get(
      torrentUrl
        .replace("{url}", encodeURIComponent(torrent.link))
        .replace("{site}", torrent.src)
        .replace("{type}", type)
    );
    return response.data;
  } else {
    throw new Error("Torrent Missing");
  }
};

const clearComplete = async (): Promise<ITorrentListResponse> => {
  try {
    const response = await axios.get(clearTorrentListUrl);
    return response.data;
  } catch (e) {
    throw new Error("Could not clear completed torrents");
  }
};

const getTorrentList = async (): Promise<ITorrentListResponse> => {
  try {
    const response = await axios.get(torrentListUrl);
    return response.data;
  } catch (e) {
    throw new Error("Could not get torrent list");
  }
};

const changeTorrentStatus = async (
  torrent: IDownload
): Promise<ITorrentListResponse> => {
  try {
    const response = await axios.get(
      changeStatusUrl
        .replace("{hash}", torrent.hash)
        .replace("{status}", (torrent.state === taskStatus.paused).toString())
    );
    return response.data;
  } catch (e) {
    throw new Error("Could not puase or resume torrent");
  }
};

const torrentSearch = async (
  search: string,
  site: string
): Promise<ITorrent[]> => {
  if (search) {
    const response = await axios.get(`${searchUrl}${search}&site=${site}`);
    return response.data.data;
  } else {
    throw new Error("Search Term Missing");
  }
};

const verifyLocation = async (): Promise<boolean> => {
  if (inDev) {
    return false;
  }

  return await axios
    .get(ipApi)
    .then(response => response.data.country === "Australia");
};

export {
  addTorrent,
  changeTorrentStatus,
  clearComplete,
  getTorrentList,
  torrentSearch,
  verifyLocation
};
