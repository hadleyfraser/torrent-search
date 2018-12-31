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

export { bytesToSize };
