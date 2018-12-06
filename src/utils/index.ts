import axios from "axios";
import { IAddTorrentResponse, ITorrent } from "src/interfaces";

const inDev = process.env.NODE_ENV === "development";

const ipApi = "http://ip-api.com/json";
const baseUrl = `http://localhost/torrent-search${inDev ? "-src" : ""}/api/?${
  inDev ? "dev=true&" : ""
}action=`;
const searchUrl = `${baseUrl}search&search=`;
const torrentUrl = `${baseUrl}download&url={url}&site={site}&type={type}`;

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

export { addTorrent, torrentSearch, verifyLocation };
