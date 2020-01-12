const fs = require('fs')
const path = require('path')
const axios = require('axios').default
const RedditImageEntry = require('./classes/RedditImageEntry')

class RedditApiImageLoader {
  constructor() {}

  getHotImagesOfSubReddit(subreddit = 'ProgrammerHumor') {
    const redditUrl = `https://www.reddit.com/r/${subreddit}/hot.json`

    return new Promise(function (resolve, reject) {
      axios.get(redditUrl)
        .then(function (response) {
          const dataChildren = response.data.data.children
          const redditImagePosts = dataChildren.map(child =>
            new RedditImageEntry(child.data, subreddit))
          
          resolve(redditImagePosts)
        })
        .catch(function (error) {
          reject(error)
          console.log(error);
        })
        .finally(function () {
          // do stuff?
        })
    })
  }

  saveRedditImageEntryToDisk(imageEntry, baseDir) {
    // guard clause
    if (!imageEntry.formattedFilename) {
      return
    }
  
    const entryPoint = path.resolve(baseDir, imageEntry.subreddit)
    const dir = path.resolve(__dirname, baseDir, imageEntry.subreddit, imageEntry.formattedFilename)
  
    // create dir if not existing
    if (!fs.existsSync(entryPoint)) {
      fs.mkdirSync(entryPoint, { recursive: true });
      console.log('done')
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
        writer.on('finish', () => console.log(`${imageEntry.imageUrl} written`))
        writer.on('error', (error) => console.log(`${imageEntry.imageUrl} error ${error}`))
      }).catch((error) => console.log(error))
    }
  }
}

module.exports = RedditApiImageLoader