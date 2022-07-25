const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_SORT_ORDER = "recent";

const States = {
  PENDING: "pending",
  READY: "ready",
  BACKOFF: "backoff",
};

let componentState = States.READY;

function isComponentPending() {
  return componentState === States.PENDING;
}

function setPending() {
  componentState = States.PENDING;
  document.body.appendChild(loadingElement);
}

function setReady() {
  componentState = States.READY;
  document.body.removeChild(loadingElement);
}

function setBackoff() {
  componentState = States.BACKOFF;
  document.body.removeChild(loadingElement);
}

let lastTweetId = null;

const loadingElement = document.createElement("div");
// Give it the same style
loadingElement.classList.add("tweet");
loadingElement.innerHTML = `
  Here I am... Loading...
  <img class="loading__image" src="http://educative.io/udata/1m5lkL7p9Q0/dog.jpeg" />
`;

function onNewTweets(data) {
  if (data.length <= 1) {
    setBackoff();
    setTimeout(() => setReady(), 2000);
  } else {
    setReady();
    let tweetsHTML = "";
    for (const tweetResponse of data) {
      const tweet = createTweet(tweetResponse.tweet);
      tweetsHTML += tweet;
      lastTweetId = tweetResponse.id;
    }
    document.body.innerHTML += tweetsHTML;
  }
}

function hydrate() {
  const params = {
    pageSize: DEFAULT_PAGE_SIZE,
    sortOrder: DEFAULT_SORT_ORDER,
  };
  api.get(HOST + "tweets", params, onNewTweets);
  setPending();
}

loadTestData();
hydrate();

function onScroll(event) {
  if (isComponentPending()) {
    return;
  }
  const scrolledTo = window.innerHeight + window.pageYOffset;
  const scrollLimit = document.body.offsetHeight;
  const scrollThreshold = 30;

  if (
    scrollLimit - scrolledTo <= scrollThreshold &&
    componentState != "backoff"
  ) {
    const params = {
      pageSize: DEFAULT_PAGE_SIZE,
      sortOrder: DEFAULT_SORT_ORDER,
      lastTweetId,
    };
    api.get(HOST + "tweets", params, onNewTweets);
    setPending();
  }
}

window.addEventListener("scroll", onScroll);

function loadTestData() {
  const sampleData = [];
  const sampleDataSize = 20;
  for (let i = 0; i < sampleDataSize; i++) {
    const message = getRandomString({
      length: getRandomInteger({ min: 10, max: 150 }),
      includeSpaces: true,
    });
    const firstName = getRandomString({
      length: getRandomInteger({ min: 3, max: 7 }),
      includeSpaces: false,
    });
    const lastName = getRandomString({
      length: getRandomInteger({ min: 3, max: 7 }),
      includeSpaces: false,
    });
    const handle =
      "@" +
      getRandomString({
        length: getRandomInteger({ min: 4, max: 8 }),
        includeSpaces: false,
      });
    sampleData.push({
      tweet: {
        name: `${firstName} ${lastName}`,
        message,
        handle,
      },
    });
  }
  for (const data of sampleData) {
    // Do nothing with result
    api.post(HOST + "tweets", data, () => {});
  }
}

class Database {
  constructor() {
    this.tweets = [];
  }

  query({ lastTweetId, pageSize }) {
    if (!lastTweetId) {
      return this.tweets.slice(0, pageSize);
    }
    for (let i = 0; i < this.tweets.length; i++) {
      const currentTweet = this.tweets[i];
      if (currentTweet.id === lastTweetId) {
        return this.tweets.slice(i + 1, i + 1 + pageSize);
      }
    }
    return [];
  }

  insert(tweet) {
    this.tweets.push({
      tweet,
      id: getRandomString({ length: 50 }),
      timestamp: new Date().getTime(),
    });
  }
}
