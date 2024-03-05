export const helpers = {
  getDay: (dayNumber: number) => {
    switch (dayNumber) {
      case 2: {
        return "Thứ 2";
      }
      case 3: {
        return "Thứ 3";
      }
      case 4: {
        return "Thứ 4";
      }
      case 5: {
        return "Thứ 5";
      }
      case 6: {
        return "Thứ 6";
      }
      case 7: {
        return "Thứ 7";
      }
      case 1: {
        return "Chủ nhật";
      }
    }
  },
  checkFileType: (fileTypeString: string | undefined) => {
    if (fileTypeString === undefined) return fileTypeString;
    const imageTypes = [
      "image/avif",
      "image/jpeg",
      "image/jpg",
      "image/jfif",
      "image/pjpeg",
      "image/pjp",
      "image/png",
      "image/svg+xml",
    ];
    const videoTypes = [
      "video/mp4",
      "video/mpeg",
      "video/ogg",
      "video/webm",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-flv",
      "video/x-matroska",
      "video/x-ms-wmv",
      "video/x-ms-asf",
    ];
    const audioTypes = [
      "audio/mpeg",
      "audio/wav",
      "audio/wave",
      "audio/x-wav",
      "audio/x-pn-wav",
      "audio/flac",
      "audio/aac",
      "audio/mp4",
      "audio/ogg",
      "audio/webm",
      // Add more audio MIME types as needed
    ];
    if (imageTypes.includes(fileTypeString)) {
      return "image";
    } else if (videoTypes.includes(fileTypeString)) {
      return "video";
    } else {
      return "file";
    }
  },
};
