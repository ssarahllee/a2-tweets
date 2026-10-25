let tweet_array = [];
let writtenTweets = [];

function parseTweets(runkeeper_tweets) {
  //Do not proceed if no tweets loaded
  if (runkeeper_tweets === undefined) {
    window.alert("No tweets returned");
    return;
  }

  tweet_array = runkeeper_tweets.map(function (tweet) {
    return new Tweet(tweet.text, tweet.created_at);
  });

  //TODO: Filter to just the written tweets
  writtenTweets = tweet_array.filter(function (tweet) {
    return tweet.written == true;
  });
  document.getElementById("searchCount").textContent = "0";
  document.getElementById("searchText").textContent = "";
}

function addEventHandlerForSearch() {
  //TODO: Search the written tweets as text is entered into the search box, and add them to the table
  const textFilter = document.getElementById("textFilter");
  const tweetTable = document.getElementById("tweetTable");
  const searchCount = document.getElementById("searchCount");
  const searchText = document.getElementById("searchText");

  textFilter.addEventListener("input", function () {
    const search = textFilter.value.trim().toLowerCase();

    // clear results when the search is empty
    if (search == "") {
      tweetTable.innerHTML = "";
      searchCount.textContent = "0";
      searchText.textContent = "";
      return;
    }

    // search for the written tweets entered into the search
    const findTweets = writtenTweets.filter(function (tweet) {
      return tweet.writtenText.toLowerCase().includes(search);
    });

    // update search count & text
    searchCount.textContent = findTweets.length;
    searchText.textContent = textFilter.value.trim();

    // clear table then add matching tweets
    tweetTable.innerHTML = "";
    for (let i = 0; i < findTweets.length; i++) {
      tweetTable.innerHTML += findTweets[i].getHTMLTableRow(i + 1);
    }
  });
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
  addEventHandlerForSearch();
  loadSavedRunkeeperTweets().then(parseTweets);
});
