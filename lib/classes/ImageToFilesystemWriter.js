const fs = require('fs')
const path = require('path')
const axios = require('axios').default

class ImageToFilesystemWriter {
  constructor() {

  }

  saveToDisk(imageEntry, baseDir) {
    const entryPoint = path.resolve(baseDir, imageEntry.subreddit)
    const dir = path.resolve(__dirname, baseDir, imageEntry.subreddit, imageEntry.formattedFilename)

    // create dir if not existing
    if (!fs.existsSync(entryPoint)) {
      fs.mkdirSync(entryPoint, {
        recursive: true
      });
    }

    // preexisting files will NOT be overwritten
    if (fs.existsSync(dir)) {
      console.log(`${imageEntry.formattedFilename} exists.`)
      return
    } else {
      const writer = fs.createWriteStream(dir)
      axios.get(imageEntry.imageUrl, {
        responseType: 'stream'
      }).then((result) => {
        result.data.pipe(writer)
        writer.on('finish', () => console.log(`${imageEntry.formattedFilename} written`))
        writer.on('error', (error) => console.log(`${imageEntry.formattedFilename} error ${error}`))
      }).catch((error) => console.log(error))
    }
  }
}

module.exports = ImageToFilesystemWriter