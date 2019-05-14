import axios from "axios";
import {
  IAddTorrentResponse,
  IDownload,
  ISearchResponse,
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
const deleteTorrentUrl = `${baseUrl}force-delete-torrent&hash={hash}`;

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

const deleteTorrent = async (
  torrent: IDownload
): Promise<ITorrentListResponse> => {
  try {
    const response = await axios.get(
      deleteTorrentUrl.replace("{hash}", torrent.hash)
    );
    return response.data;
  } catch (e) {
    throw new Error("Could not delete torrent");
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
        .replace(
          "{status}",
          (
            torrent.state === taskStatus.paused ||
            torrent.state === taskStatus.failed
          ).toString()
        )
    );
    return response.data;
  } catch (e) {
    throw new Error("Could not puase or resume torrent");
  }
};

const torrentSearch = async (
  search: string,
  site: string
): Promise<ISearchResponse> => {
  if (search) {
    const response = await axios.get(`${searchUrl}${search}&site=${site}`);
    return { data: response.data.data, search };
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
  deleteTorrent,
  getTorrentList,
  torrentSearch,
  verifyLocation
};
