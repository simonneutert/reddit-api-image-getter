# Reddit API Image Getter

## Install

`npm i reddit-api-image-getter --save`

## Open Source

Check out the source code on GitHub and dig in a little for yourself.

## Example

~~~ javascript
// example
const path = require('path')
RedditImageGetter = require('reddit-api-image-getter')
redditImageGetter = new RedditApiImageGetter()

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
redditImageGetter.getHotImagesOfSubReddit('ProgrammerHumor').
then(function (result) {
  for (let imageEntry of result) {
    redditImageGetter.saveRedditImageEntryToDisk(imageEntry, path.resolve(__dirname, 'images'))
  }
}).catch(function (error) {
  console.log(error)
})
~~~

~~~javascript
// example
redditApiImageGetter = require('../reddit-api-image-getter')
const path = require('path')

getter = new redditApiImageGetter()

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
    getter.saveRedditImageEntryToDisk(imageEntry, path.resolve(__dirname, 'images', 'hot'))
  }
}).catch(function (error) {
  console.log(error)
})

getter.getTopImagesOfSubReddit('ProgrammerHumor').then(function (result) {
  for (imageEntry of result) {
    getter.saveRedditImageEntryToDisk(imageEntry, path.resolve(__dirname, 'images', 'top'))
  }
}).catch(function (error) {
  console.log(error)
})
~~~

## Example with Telegram Bot

https://www.simon-neutert.de/2020/telegraf-bot-nodejs/

## Inspiration

go crazy, send the pictures to your telegram via a bot (using a [bot](https://core.telegram.org/bots/samples#node-js)) and make your day a happy day :tada: