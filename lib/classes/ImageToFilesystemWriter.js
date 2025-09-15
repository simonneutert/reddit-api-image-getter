const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

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

      const cleanup = (error) => {
        if (error) {
          console.log(`${imageEntry.formattedFilename} error: ${error}`);
        }
        if (!writer.destroyed) {
          writer.destroy();
        }
      };

      writer.on("finish", () => {
        console.log(`${imageEntry.formattedFilename} written`);
      });

      writer.on("error", cleanup);

      const protocol = imageEntry.imageUrl.startsWith('https:') ? https : http;

      protocol.get(imageEntry.imageUrl, (response) => {
        if (response.statusCode !== 200) {
          cleanup(new Error(`HTTP ${response.statusCode}`));
          return;
        }
        response.pipe(writer);
      }).on('error', cleanup);
    }
  }
}

module.exports = ImageToFilesystemWriter;
