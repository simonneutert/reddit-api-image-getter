class RedditEntryStack {
  constructor() {
    this.stack = [];
  }

  save(entry) {
    if (entry.imageUrl !== undefined) {
      this.stack.push(entry);
      return this.stack;
    } else {
      return undefined;
    }
  }
}

module.exports = RedditEntryStack;
