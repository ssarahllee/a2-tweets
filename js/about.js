function parseTweets(runkeeper_tweets) {
  //Do not proceed if no tweets loaded
  if (runkeeper_tweets === undefined) {
    window.alert("No tweets returned");
    return;
  }
  tweet_array = runkeeper_tweets.map(function (tweet) {
    return new Tweet(tweet.text, tweet.created_at);
  });

  //This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
  //It works correctly, your task is to update the text of the other tags in the HTML file!
  document.getElementById("numberTweets").innerText = tweet_array.length;
  updateDates(tweet_array);
  tweetCategory(tweet_array);
  writtenTweets(tweet_array);
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
  loadSavedRunkeeperTweets().then(parseTweets);
});

function updateDates(tweets) {
  let earliest = tweets[0].time;
  let latest = tweets[0].time;
  let current;
  if (tweets.length == 0) {
    return;
  }
  for (let i = 0; i < tweets.length; i++) {
    current = tweets[i].time;
    if (current < earliest) {
      earliest = current;
    }
    if (current > latest) {
      latest = current;
    }
  }
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  document.getElementById("firstDate").innerText = earliest.toLocaleDateString(
    "en-US",
    options,
  );
  document.getElementById("lastDate").innerText = latest.toLocaleDateString(
    "en-US",
    options,
  );
}

function tweetCategory(tweets) {
  let completed = 0;
  let live = 0;
  let achievement = 0;
  let miscellaneous = 0;
  let category = 0;
  for (let i = 0; i < tweets.length; i++) {
    category = tweets[i].source;
    if (category == "completed_event") {
      completed++;
    } else if (category == "live_event") {
      live++;
    } else if (category == "achievement") {
      achievement++;
    } else if (category == "miscellaneous") {
      miscellaneous++;
    }
  }
  // console.log(completed); 7982
  // console.log(live); 141
  // console.log(achievement); 56
  // console.log(miscellaneous); 68

  // calculating percentagtes
  let completedPercent = ((completed / tweets.length) * 100).toFixed(2);
  let livePercent = ((live / tweets.length) * 100).toFixed(2);
  let achievedPercent = ((achievement / tweets.length) * 100).toFixed(2);
  let miscPercent = ((miscellaneous / tweets.length) * 100).toFixed(2);
  // display total counts
  document.getElementsByClassName("completedEvents")[0].innerText = completed;
  document.getElementsByClassName("liveEvents")[0].innerText = live;
  document.getElementsByClassName("achievements")[0].innerText = achievement;
  document.getElementsByClassName("miscellaneous")[0].innerText = miscellaneous;
  // display percentages
  document.getElementsByClassName("completedEventsPct")[0].innerText =
    completedPercent + "%";
  document.getElementsByClassName("liveEventsPct")[0].innerText =
    livePercent + "%";
  document.getElementsByClassName("achievementsPct")[0].innerText =
    achievedPercent + "%";
  document.getElementsByClassName("miscellaneousPct")[0].innerText =
    miscPercent + "%";
}

function writtenTweets(tweets) {
  let completed = 0;
  let written = 0;
  for (let i = 0; i < tweets.length; i++) {
    if (tweets[i].source == "completed_event") {
      completed++;
      if (tweets[i].written == true) {
        written++;
      }
    }
  }
  const writtenPercent = ((written / completed) * 100).toFixed(2);
  document.getElementsByClassName("completedEvents")[1].innerText = completed;
  document.getElementsByClassName("written")[0].innerText = written;
  document.getElementsByClassName("writtenPct")[0].innerText =
    writtenPercent + "%";
}
