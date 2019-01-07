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
  } else if (parsedUrl["amp;dn"]) {
    return parsedUrl["amp;dn"];
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

/*
 * @param color The color to tint
 * @param percent Can be either positive or negative up to 100
 *
 * @see https://gist.github.com/renancouto/4675192
 */
const tintColor = (color: string, percent: number): string => {
  const colorWithoutHash = color.replace("#", "");
  const num = parseInt(colorWithoutHash, 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const B = ((num >> 8) & 0x00ff) + amt;
  const G = (num & 0x0000ff) + amt;

  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
      (G < 255 ? (G < 1 ? 0 : G) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

export {
  bytesToSize,
  findTorrentToDownload,
  getNameFromMagent,
  getTorrentStatus,
  isTorrentSelected,
  secondsToTime,
  tintColor
};
