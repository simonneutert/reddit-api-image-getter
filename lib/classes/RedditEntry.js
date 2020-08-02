class RedditEntry {
  constructor(data, subreddit) {
    // this.data = data
    this.created_utc = data.created_utc;
    this.title = data.title;
    this.url = data.url;
    this.subreddit = subreddit;
  }

  get imageUrl() {
    if (this.urlIsImage() == true) {
      return this.url;
    } else {
      return undefined;
    }
  }

  get formattedFilename() {
    if (this.imageUrl !== undefined) {
      const fileending = this.imageUrl.split(".").slice(-1)[0];
      const filename = `${this.created_utc}_${this.title}`;
      return `${this.sanitizeFilename(filename)}.${fileending}`;
    } else {
      return undefined;
    }
  }

  sanitizeFilename(filenameString) {
    return filenameString.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  }

  urlIsImage() {
    const isDefined = this.url !== undefined;
    const regexImage = this.url.match(/\.(gif|jpeg|jpg|png)$/ig) !== null;
    return isDefined && regexImage;
  }
}

module.exports = RedditEntry;
