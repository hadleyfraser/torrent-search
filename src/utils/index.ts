import { qs } from "url-parse";
import { taskStatus } from "src/constants";
import { IDownload, ITorrent, ITorrentWithStatus } from "src/interfaces";

const bytesToSize = bytes => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) {
    return "0 Byte";
  }
  const sizePosition = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round((bytes / Math.pow(1024, sizePosition)) * 100) / 100} ${
    sizes[sizePosition]
  }`;
};

const findTorrentToDownload = (
  torrentList: ITorrent[],
  link: string
): ITorrentWithStatus => {
  let foundTorrent = null;
  torrentList.some(torrent => {
    if (torrent.link === link) {
      foundTorrent = torrent;
      return true;
    }
  });

  return foundTorrent;
};

const getNameFromMagent = (magnet: string): string => {
  const parsedUrl = qs.parse(magnet) as any;
  if (parsedUrl.dn) {
    return parsedUrl.dn;
  }
  return "";
};

const getTorrentStatus = (torrent: IDownload): string | boolean => {
  switch (torrent.state) {
    case taskStatus.paused:
      return "Paused";
    case taskStatus.stopped:
      return "Stopped";
    case taskStatus.failed:
      return "Failed";
    case taskStatus.queuing:
      return "Waiting";
    default:
      return false;
  }
};

const isTorrentSelected = (
  torrent: ITorrent,
  selectedTorrents: ITorrent[]
): number => {
  if (!torrent || !selectedTorrents) {
    return -1;
  }

  let position = -1;
  selectedTorrents.some((t, i) => {
    if (t.link === torrent.link) {
      position = i;
      return true;
    }
  });
  return position;
};

const secondsToTime = (seconds: number): string => {
  let remainingSeconds = seconds;
  const remainingHours = Math.floor(seconds / 60 / 60);
  remainingSeconds -= remainingHours * 60 * 60;

  let remainingMinutes = Math.floor(remainingSeconds / 60);
  remainingSeconds -= remainingMinutes * 60;

  let prefix = "";
  if (remainingHours > 0) {
    remainingMinutes = remainingMinutes.toString().padStart(2, "0") as any;
    prefix = `${remainingHours}:`;
  }

  return `${prefix}${remainingMinutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

export {
  bytesToSize,
  findTorrentToDownload,
  getNameFromMagent,
  getTorrentStatus,
  isTorrentSelected,
  secondsToTime
};
