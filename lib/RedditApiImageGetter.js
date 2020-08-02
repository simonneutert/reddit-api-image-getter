const axios = require("axios").default;
const RedditImageEntry = require("./classes/RedditImageEntry");
const ImageToFileSystemWriter = require("./classes/ImageToFilesystemWriter");

class RedditApiImageGetter {
  constructor() {}

  // quick function that gets the current hot entries
  // returns a Promise
  getHotImagesOfSubReddit(subreddit = "ProgrammerHumor") {
    const redditUrl = `https://www.reddit.com/r/${subreddit}/hot.json`;
    return this.getJsonFromReddit(subreddit, redditUrl);
  }

  // quick function that gets the current top entries
  // returns a Promise
  getTopImagesOfSubReddit(subreddit = "ProgrammerHumor") {
    const redditUrl = `https://www.reddit.com/r/${subreddit}/top.json`;
    return this.getJsonFromReddit(subreddit, redditUrl);
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
          const dataChildren = response.data.data.children;
          const redditImagePosts = dataChildren.map((child) =>
            new RedditImageEntry(child.data, subreddit)
          );
          resolve(redditImagePosts);
        })
        .catch(function (error) {
          console.log(error);
          reject(error);
        })
        .finally(function () {
          // do stuff?
          // maybe allow devs to add another function to call?
        });
    });
  }

  saveRedditImageEntryToDisk(imageEntry, targetDir) {
    // do not write to disk, when no filename was parsed
    if (imageEntry.formattedFilename !== undefined) {
      const fsWriter = new ImageToFileSystemWriter();
      fsWriter.saveToDisk(imageEntry, targetDir);
      return imageEntry.formattedFilename;
    }
  }
}

module.exports = RedditApiImageGetter;
