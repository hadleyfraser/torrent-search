import axios from "axios";
import { ITorrent } from "src/interfaces";

const inDev = process.env.NODE_ENV === "development";

const ipApi = "http://ip-api.com/json";
const baseUrl = `http://localhost/torrent-search${inDev ? "-src" : ""}/api/?${
  inDev ? "dev=true&" : ""
}action=`;
const searchUrl = `${baseUrl}search&search=`;
const torrentUrl = `${baseUrl}download&url=`;

const getTorrentUrl = async (torrent: ITorrent): Promise<string> => {
  if (torrent.src === "1337x") {
    return await getDownloadUrl(torrent.link);
  }
  return torrent.link;
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

const getDownloadUrl = async (url: string): Promise<string> => {
  if (url) {
    const response = await axios.get(`${torrentUrl}${url}`);
    return response.data.data;
  } else {
    throw new Error("Torrent URL Missing");
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

export { getTorrentUrl, torrentSearch, verifyLocation };
