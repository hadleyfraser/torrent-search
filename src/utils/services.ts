import axios from "axios";
import {
  IAddTorrentResponse,
  IDownload,
  ITorrent,
  ITorrentListResponse
} from "src/interfaces";

const inDev = process.env.NODE_ENV === "development";

const ipApi = "http://ip-api.com/json";
const baseUrl = `http://localhost/torrent-search${inDev ? "-src" : ""}/api/?${
  inDev ? "dev=true&" : ""
}action=`;
const searchUrl = `${baseUrl}search&search=`;
const torrentUrl = `${baseUrl}download&url={url}&site={site}&type={type}`;
const torrentListUrl = `${baseUrl}download-list`;
const clearTorrentListUrl = `${baseUrl}clear-download-list`;

const addTorrent = async (
  torrent: ITorrent,
  type: string
): Promise<IAddTorrentResponse> => {
  if (torrent.link) {
    const response = await axios.get(
      `${torrentUrl
        .replace("{url}", encodeURIComponent(torrent.link))
        .replace("{site}", torrent.src)
        .replace("{type}", type)}`
    );
    return response.data;
  } else {
    throw new Error("Torrent Missing");
  }
};

const clearComplete = async (): Promise<boolean> => {
  try {
    await axios.get(clearTorrentListUrl);
    return true;
  } catch (e) {
    return false;
  }
};

const getTorrentList = async (): Promise<IDownload[]> => {
  // const response = await axios.get(torrentListUrl);
  // return response.data;
  const response: ITorrentListResponse = require("./torrent-list.json");
  return response.data;
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
  clearComplete,
  getTorrentList,
  torrentSearch,
  verifyLocation
};
