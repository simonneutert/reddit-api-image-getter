# Reddit Image Getter

## Install

`npm i reddit-api-image-getter --save`

## Example

~~~ javascript
// example
redditImageGetter = require('./lib/redditImageGetter')
const path = require('path')

loader = new redditImageGetter()

loader.getHotImagesOfSubReddit('ProgrammerHumor').then(function (result) {
  for (imageEntry of result) {
    loader.saveRedditImageEntryToDisk(imageEntry, path.resolve(__dirname, 'images'))
  }
}).catch(function (error) {
  console.log(error)
})
~~~

## Inspiration

go crazy, send the pictures to your telegram via a bot (using a [bot](https://core.telegram.org/bots/samples#node-js)) and make your day a happy day :tada: