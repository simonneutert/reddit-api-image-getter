#!/usr/bin/env node

const RedditApiImageGetter = require('../index.js');
const path = require('path');
const fs = require('fs');

function showHelp() {
  console.log(`
Reddit API Image Getter CLI

Usage:
  reddit-images <subreddit> [options]

Arguments:
  subreddit           The subreddit name (without r/)

Options:
  -h, --help         Show this help message
  -t, --top          Get top images instead of hot (default: hot)
  -o, --output DIR   Output directory (default: ./images)
  -v, --version      Show version number

Examples:
  reddit-images ProgrammerHumor
  reddit-images typescript --top
  reddit-images javascript --output ./my-images
  reddit-images memes -t -o ~/Downloads/reddit-images
`);
}

function showVersion() {
  const packageJson = require('../package.json');
  console.log(packageJson.version);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    showHelp();
    process.exit(0);
  }

  if (args.includes('-v') || args.includes('--version')) {
    showVersion();
    process.exit(0);
  }

  const subreddit = args[0];
  const useTop = args.includes('-t') || args.includes('--top');

  let outputDir = './images';
  const outputIndex = args.findIndex(arg => arg === '-o' || arg === '--output');
  if (outputIndex !== -1 && args[outputIndex + 1]) {
    outputDir = args[outputIndex + 1];
  }

  // Resolve to absolute path
  outputDir = path.resolve(outputDir);

  console.log(`🔍 Fetching ${useTop ? 'top' : 'hot'} images from r/${subreddit}...`);
  console.log(`📁 Output directory: ${outputDir}`);

  try {
    const getter = new RedditApiImageGetter();
    const images = useTop
      ? await getter.getTopImagesOfSubReddit(subreddit)
      : await getter.getHotImagesOfSubReddit(subreddit);

    const imageEntries = images.filter(img => img.imageUrl !== undefined);

    if (imageEntries.length === 0) {
      console.log('⚠️  No images found in this subreddit');
      process.exit(0);
    }

    console.log(`✅ Found ${imageEntries.length} images`);

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('📥 Downloading images...');

    let downloaded = 0;
    let skipped = 0;

    for (const imageEntry of imageEntries) {
      const filename = getter.saveRedditImageEntryToDisk(imageEntry, outputDir);
      if (filename) {
        downloaded++;
        console.log(`  ✓ ${filename}`);
      } else {
        skipped++;
      }
    }

    console.log(`\n🎉 Download complete!`);
    console.log(`📊 Downloaded: ${downloaded}, Skipped: ${skipped}`);
    console.log(`📂 Images saved to: ${path.resolve(outputDir, subreddit)}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});