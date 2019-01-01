import { taskStatus } from "src/constants";
import { IDownload } from "src/interfaces";

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

const getTorrentStatus = (torrent: IDownload): string | boolean => {
  switch (torrent.state) {
    case taskStatus.paused:
      return "Paused";
    case taskStatus.stopped:
      return "Stopped";
    default:
      return false;
  }
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

export { bytesToSize, getTorrentStatus, secondsToTime };
