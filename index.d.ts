/**
 * Represents a Reddit post entry with image capabilities
 */
declare class RedditImageEntry {
  /** The title of the Reddit post */
  title: string;
  /** The URL of the image (if post contains a valid image) */
  imageUrl?: string;
  /** The sanitized filename for saving to disk */
  formattedFilename?: string;
  /** The subreddit name */
  subreddit: string;
  /** Unix timestamp when the post was created */
  created_utc: number;

  constructor(data: any, subreddit: string);
}

/**
 * Reddit API Image Getter - Fetches and downloads images from Reddit subreddits
 */
declare class RedditApiImageGetter {
  constructor();

  /**
   * Gets the current hot image posts from a subreddit
   * @param subreddit The subreddit name (defaults to "ProgrammerHumor")
   * @returns Promise that resolves to an array of Reddit image entries
   */
  getHotImagesOfSubReddit(subreddit?: string): Promise<RedditImageEntry[]>;

  /**
   * Gets the current top image posts from a subreddit
   * @param subreddit The subreddit name (defaults to "ProgrammerHumor")
   * @returns Promise that resolves to an array of Reddit image entries
   */
  getTopImagesOfSubReddit(subreddit?: string): Promise<RedditImageEntry[]>;

  /**
   * Saves a Reddit image entry to disk
   * @param imageEntry The image entry to save
   * @param targetDir The target directory path
   * @returns The filename if saved, undefined if skipped
   */
  saveRedditImageEntryToDisk(imageEntry: RedditImageEntry, targetDir: string): string | undefined;
}

declare namespace RedditApiImageGetter {
  export { RedditImageEntry };
}

export = RedditApiImageGetter;