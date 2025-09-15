// TypeScript compilation test to validate type definitions
// This file should compile without errors if types are correct

import RedditApiImageGetter = require('./index.js');
import RedditImageEntry = RedditApiImageGetter.RedditImageEntry;

// Test class instantiation
const getter = new RedditApiImageGetter();

// Test method signatures and return types
async function testTypes() {
  // Test getHotImagesOfSubReddit
  const hotImages: RedditImageEntry[] = await getter.getHotImagesOfSubReddit();
  const hotImagesWithParam: RedditImageEntry[] = await getter.getHotImagesOfSubReddit('typescript');

  // Test getTopImagesOfSubReddit
  const topImages: RedditImageEntry[] = await getter.getTopImagesOfSubReddit();
  const topImagesWithParam: RedditImageEntry[] = await getter.getTopImagesOfSubReddit('javascript');

  // Test RedditImageEntry properties
  if (hotImages.length > 0) {
    const entry = hotImages[0];

    // Required properties
    const title: string = entry.title;
    const subreddit: string = entry.subreddit;
    const createdUtc: number = entry.created_utc;

    // Optional properties
    const imageUrl: string | undefined = entry.imageUrl;
    const filename: string | undefined = entry.formattedFilename;

    // Test saveRedditImageEntryToDisk
    if (entry.imageUrl) {
      const result: string | undefined = getter.saveRedditImageEntryToDisk(entry, '/tmp');
    }
  }
}

// Test that wrong types cause compilation errors (these should be commented out in real usage)
// const getter2 = new RedditApiImageGetter(123); // Should error - constructor takes no params
// const wrongReturn: string = await getter.getHotImagesOfSubReddit(); // Should error - returns Promise<RedditImageEntry[]>
// getter.saveRedditImageEntryToDisk("not an entry", "/tmp"); // Should error - wrong param type

console.log('✅ TypeScript types compilation test passed!');