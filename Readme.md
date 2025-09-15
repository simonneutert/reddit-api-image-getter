# Reddit API Image Getter

CLI tool and Node.js library to fetch and download images from Reddit subreddits. Zero dependencies, uses modern Node.js built-in modules.

## Install

**As a CLI tool (global):**
```bash
npm install -g reddit-api-image-getter
```

**As a Node.js library:**
```bash
npm install reddit-api-image-getter --save
```

## CLI Usage

After global installation, use the `reddit-images` command:

```bash
# Download hot images from a subreddit
reddit-images ProgrammerHumor

# Download top images instead of hot
reddit-images typescript --top

# Specify custom output directory
reddit-images javascript --output ./my-images

# Short flags
reddit-images memes -t -o ~/Downloads/reddit-images

# Show help
reddit-images --help

# Show version
reddit-images --version
```

### CLI Options

- `<subreddit>` - The subreddit name (without r/)
- `-t, --top` - Get top images instead of hot (default: hot)
- `-o, --output DIR` - Output directory (default: ./images)
- `-h, --help` - Show help message
- `-v, --version` - Show version number

Images are automatically organized into subdirectories by subreddit name.

## Library Usage (Node.js)

Use as a Node.js library in your projects:

## Example

```javascript
const path = require('path');
const RedditApiImageGetter = require('reddit-api-image-getter');

const getter = new RedditApiImageGetter();

// `getHotImagesOfSubReddit('subreddit')`
// returns a Promise, that, when successful returns
// an Array containing RedditImageEntry object instances.
// 
// Each RedditImageEntry object is then passed to
// `saveRedditImageEntryToDisk(imageEntry, path)`
// to be saved to disk. 
//
// See what each RedditImageEntry does in 
// lib/classes/RedditImageEntry.js and lib/classes/RedditEntry.js
//
// get the top images of a subreddit: using
// getTopImagesOfSubReddit(subreddit = 'ProgrammerHumor')
// 
getter.getHotImagesOfSubReddit('ProgrammerHumor').then(function (result) {
  for (imageEntry of result) {
    const targetDirectory = path.resolve(__dirname, 'images', 'hot');
    getter.saveRedditImageEntryToDisk(imageEntry, targetDirectory);
  }
}).catch(function (error) {
  console.log(error)
})

getter.getTopImagesOfSubReddit('ProgrammerHumor').then(function (result) {
  for (imageEntry of result) {
    // do begin with a starting '/' if you need to: 
    // https://nodejs.org/api/path.html#path_path_resolve_paths
    const targetDirectory = path.resolve(__dirname, 'images', 'top');
    getter.saveRedditImageEntryToDisk(imageEntry, targetDirectory);
  }
}).catch(function (error) {
  console.log(error);
});
```

### Modern async/await syntax:

```javascript
const RedditApiImageGetter = require('reddit-api-image-getter');
const path = require('path');

async function downloadImages() {
  const getter = new RedditApiImageGetter();

  try {
    // Get hot images
    const hotImages = await getter.getHotImagesOfSubReddit('ProgrammerHumor');
    const targetDirectory = path.resolve(__dirname, 'images', 'hot');

    for (const imageEntry of hotImages) {
      if (imageEntry.imageUrl) {
        getter.saveRedditImageEntryToDisk(imageEntry, targetDirectory);
      }
    }

    console.log(`Downloaded ${hotImages.length} images`);
  } catch (error) {
    console.error('Error:', error);
  }
}

downloadImages();
```

## Requirements

- Node.js >=21.0.0 (for built-in `fetch` support)
- Zero dependencies!

## Features

- ✅ **Zero dependencies** - Uses only Node.js built-in modules
- ✅ **CLI tool** - Use from command line globally
- ✅ **Node.js library** - Integrate into your projects
- ✅ **TypeScript support** - Full type definitions included
- ✅ **Modern async/await** - Clean, modern JavaScript
- ✅ **Automatic file organization** - Images sorted by subreddit
- ✅ **Duplicate prevention** - Won't overwrite existing files

## Example with Telegram Bot

https://www.simon-neutert.de/2020/telegraf-bot-nodejs/

## Contributing

Check out the source code on GitHub and feel free to contribute!