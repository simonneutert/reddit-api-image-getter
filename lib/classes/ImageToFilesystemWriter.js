const fs = require("fs");
const path = require("path");
const axios = require("axios").default;

class ImageToFilesystemWriter {
  constructor() {}

  saveToDisk(imageEntry, targetDir) {
    const entryPoint = path.resolve(targetDir, imageEntry.subreddit);
    const dir = path.resolve(
      targetDir,
      imageEntry.subreddit,
      imageEntry.formattedFilename,
    );

    // create dir if not existing
    if (!fs.existsSync(entryPoint)) {
      fs.mkdirSync(entryPoint, {
        recursive: true,
      });
    }

    // preexisting files will NOT be overwritten
    if (fs.existsSync(dir)) {
      console.log(`${imageEntry.formattedFilename} exists.`);
      return;
    } else {
      const writer = fs.createWriteStream(dir);
      writer.on(
        "finish",
        () => console.log(`${imageEntry.formattedFilename} written`),
      );
      writer.on(
        "error",
        (error) =>
          console.log(`${imageEntry.formattedFilename} error ${error}`),
      );
      axios.get(imageEntry.imageUrl, {
        responseType: "stream",
      }).then((result) => {
        result.data.pipe(writer);
      }).catch((error) => console.log(error));
    }
  }
}

module.exports = ImageToFilesystemWriter;
