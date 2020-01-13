const fs = require('fs')
const path = require('path')
const axios = require('axios').default
const RedditImageEntry = require('./classes/RedditImageEntry')

class RedditApiImageLoader {
  constructor() {}

  // quick function that gets the current hot entries
  // returns a Promise
  getHotImagesOfSubReddit(subreddit = 'ProgrammerHumor') {
    const redditUrl = `https://www.reddit.com/r/${subreddit}/hot.json`
    return this.getJsonFromReddit(subreddit, redditUrl)
  }

  // quick function that gets the current top entries
  // returns a Promise
  getTopImagesOfSubReddit(subreddit = 'ProgrammerHumor') {
    const redditUrl = `https://www.reddit.com/r/${subreddit}/top.json`
    return this.getJsonFromReddit(subreddit, redditUrl)
  }

  // pass in the name of the subreddit and the url to 
  // the json endpoint, this can either be hot/popular/top 
  // i.e. 'https://www.reddit.com/r/programmerhumor/hot.json'
  //
  // returns a Promise
  getJsonFromReddit(subreddit, redditUrl) {
    return new Promise(function (resolve, reject) {
      axios.get(redditUrl)
        .then(function (response) {
          const dataChildren = response.data.data.children
          const redditImagePosts = dataChildren.map(child =>
            new RedditImageEntry(child.data, subreddit))
          resolve(redditImagePosts)
        })
        .catch(function (error) {
          console.log(error);
          reject(error)
        })
        .finally(function () {
          // do stuff? 
          // maybe allow devs to add another function to call?
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

module.exports = RedditApiImageLoader