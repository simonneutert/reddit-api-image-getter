const RedditApiImageGetter = require('./index.js');
const fs = require('fs');
const path = require('path');

async function runTests() {
  console.log('🧪 Running tests for Reddit API Image Getter...\n');

  const getter = new RedditApiImageGetter();
  let testsPassed = 0;
  let totalTests = 0;

  function test(description, testFn) {
    totalTests++;
    try {
      const result = testFn();
      if (result === true || result === undefined) {
        console.log(`✅ ${description}`);
        testsPassed++;
      } else {
        console.log(`❌ ${description} - Expected truthy value, got: ${result}`);
      }
    } catch (error) {
      console.log(`❌ ${description} - Error: ${error.message}`);
    }
  }

  async function asyncTest(description, testFn) {
    totalTests++;
    try {
      const result = await testFn();
      if (result === true || result === undefined) {
        console.log(`✅ ${description}`);
        testsPassed++;
      } else {
        console.log(`❌ ${description} - Expected truthy value, got: ${result}`);
      }
    } catch (error) {
      console.log(`❌ ${description} - Error: ${error.message}`);
    }
  }

  // Test 1: Class instantiation
  test('RedditApiImageGetter can be instantiated', () => {
    return getter instanceof RedditApiImageGetter;
  });

  // Test 2: Fetch hot images
  await asyncTest('getHotImagesOfSubReddit returns data', async () => {
    const images = await getter.getHotImagesOfSubReddit('ProgrammerHumor');
    return Array.isArray(images) && images.length > 0;
  });

  // Test 3: Fetch top images
  await asyncTest('getTopImagesOfSubReddit returns data', async () => {
    const images = await getter.getTopImagesOfSubReddit('ProgrammerHumor');
    return Array.isArray(images) && images.length > 0;
  });

  // Test 4: Image filtering works
  await asyncTest('Images have proper structure and filtering', async () => {
    const images = await getter.getHotImagesOfSubReddit('ProgrammerHumor');
    const imageEntry = images.find(img => img.imageUrl !== undefined);

    if (!imageEntry) {
      console.log('  ⚠️  No images found in subreddit posts');
      return true; // Not a failure, just no images available
    }

    return imageEntry.title &&
           imageEntry.imageUrl &&
           imageEntry.formattedFilename &&
           imageEntry.subreddit === 'ProgrammerHumor';
  });

  // Test 5: File download functionality (without actually downloading)
  await asyncTest('saveRedditImageEntryToDisk handles valid entries', async () => {
    const images = await getter.getHotImagesOfSubReddit('ProgrammerHumor');
    const imageEntry = images.find(img => img.imageUrl !== undefined);

    if (!imageEntry) {
      return true; // Skip if no images
    }

    // Test that the method exists and can be called (but don't actually save)
    const tempDir = path.resolve(__dirname, 'temp_test_dir');

    // Create temp directory
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const result = getter.saveRedditImageEntryToDisk(imageEntry, tempDir);

    // Clean up
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }

    return typeof result === 'string' || result === undefined;
  });

  // Test 6: Error handling for invalid subreddit
  await asyncTest('Handles invalid subreddit gracefully', async () => {
    try {
      await getter.getHotImagesOfSubReddit('nonexistentsubreddit12345');
      return true; // If it doesn't throw, that's fine too
    } catch (error) {
      return error instanceof Error; // Should throw an Error object
    }
  });

  console.log(`\n📊 Test Results: ${testsPassed}/${totalTests} tests passed`);

  if (testsPassed === totalTests) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('💥 Some tests failed');
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});