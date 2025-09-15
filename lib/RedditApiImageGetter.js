const RedditImageEntry = require("./classes/RedditImageEntry");
const ImageToFileSystemWriter = require("./classes/ImageToFilesystemWriter");

/**
 * Reddit API Image Getter - Fetches and downloads images from Reddit subreddits
 * @class RedditApiImageGetter
 */
class RedditApiImageGetter {
  constructor() {}

  /**
   * Gets the current hot image posts from a subreddit
   * @param {string} [subreddit="ProgrammerHumor"] - The subreddit name
   * @returns {Promise<RedditImageEntry[]>} Array of Reddit image entries
   */
  getHotImagesOfSubReddit(subreddit = "ProgrammerHumor") {
    const redditUrl = `https://www.reddit.com/r/${subreddit}/hot.json`;
    return this.getJsonFromReddit(subreddit, redditUrl);
  }

  /**
   * Gets the current top image posts from a subreddit
   * @param {string} [subreddit="ProgrammerHumor"] - The subreddit name
   * @returns {Promise<RedditImageEntry[]>} Array of Reddit image entries
   */
  getTopImagesOfSubReddit(subreddit = "ProgrammerHumor") {
    const redditUrl = `https://www.reddit.com/r/${subreddit}/top.json`;
    return this.getJsonFromReddit(subreddit, redditUrl);
  }

  /**
   * Fetches JSON data from Reddit API and returns parsed image entries
   * @param {string} subreddit - The subreddit name
   * @param {string} redditUrl - The Reddit JSON API URL (hot/top/etc)
   * @returns {Promise<RedditImageEntry[]>} Array of Reddit image entries
   * @private
   */
  async getJsonFromReddit(subreddit, redditUrl) {
    try {
      const response = await fetch(redditUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const dataChildren = data.data.children;
      const redditImagePosts = dataChildren.map((child) =>
        new RedditImageEntry(child.data, subreddit)
      );
      return redditImagePosts;
    } catch (error) {
      console.error(`Failed to fetch Reddit data for subreddit "${subreddit}" from URL "${redditUrl}":`, error);
      throw error;
    }
  }

  /**
   * Saves a Reddit image entry to disk
   * @param {RedditImageEntry} imageEntry - The image entry to save
   * @param {string} targetDir - The target directory path
   * @returns {string|undefined} The filename if saved, undefined if skipped
   */
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
