function parseTweets(runkeeper_tweets) {
  //Do not proceed if no tweets loaded
  if (runkeeper_tweets === undefined) {
    window.alert("No tweets returned");
    return;
  }

  tweet_array = runkeeper_tweets.map(function (tweet) {
    return new Tweet(tweet.text, tweet.created_at);
  });

  const completedTweets = tweet_array.filter(function (tweet) {
    return tweet.source == "completed_event";
  });

  let activityCount = {};
  for (let i = 0; i < completedTweets.length; i++) {
    const activity = completedTweets[i].activityType;
    if (activity == "unknown") {
      continue;
    }
    if (activityCount[activity] == undefined) {
      activityCount[activity] = 1;
    } else {
      activityCount[activity]++;
    }
  }
  console.log(activityCount);

  document.getElementById("numberActivities").innerText =
    Object.keys(activityCount).length;
  document.getElementById("firstMost").innerText = "run";
  document.getElementById("secondMost").innerText = "walk";
  document.getElementById("thirdMost").innerText = "bike";
  document.getElementById("longestActivityType").innerText = "bike";
  document.getElementById("shortestActivityType").innerText = "walk";
  document.getElementById("weekdayOrWeekendLonger").innerText = "weekends";

  //TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
  // graph 1 - activity types graph
  const activityData = [];
  for (const activity in activityCount) {
    activityData.push({
      activity: activity,
      count: activityCount[activity],
    });
  }
  console.log(activityData);

  activity_vis_spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description:
      "A graph of the number of Tweets containing each type of activity.",
    data: {
      values: activityData,
    },
    //TODO: Add mark and encoding
    mark: "bar",
    encoding: {
      x: {
        field: "activity",
        type: "nominal",
        axis: { title: "Activity Type" },
      },
      y: {
        field: "count",
        type: "quantitative",
        axis: { title: "Tweet Count" },
      },
      color: { field: "activity", type: "nominal" },
    },
  };
  vegaEmbed("#activityVis", activity_vis_spec, { actions: false });

  //TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
  // graph 2 - all distance chart
  const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const distanceByDayData = tweet_array
    .filter(function (tweet) {
      return (
        // must satisfy: completed, one of the top three, and a positive distance
        tweet.source == "completed_event" &&
        (tweet.activityType == "run" ||
          tweet.activityType == "walk" ||
          tweet.activityType == "bike") &&
        tweet.distance > 0
      );
    })
    .map(function (tweet) {
      return {
        day: dayOfWeek[tweet.time.getDay()],
        activity: tweet.activityType,
        distance: tweet.distance,
      };
    });
  // console.log(distanceByDayData);

  const distance_vis_spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description:
      "A graph of the individual activity distances by day of the week.",
    data: {
      values: distanceByDayData,
    },
    mark: "point",
    encoding: {
      x: {
        field: "day",
        type: "ordinal",
        sort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        axis: { title: "Time (Day)" },
      },
      y: {
        field: "distance",
        type: "quantitative",
        axis: { title: "Distance" },
      },
      color: {
        field: "activity",
        type: "nominal",
      },
    },
  };
  vegaEmbed("#distanceVis", distance_vis_spec, { actions: false });
  //Use those visualizations to answer the questions about which activities tended to be longest and when.
  // graph 3 - mean distance chart
  const meanByDayData = [];
  const total = {};

  for (let i = 0; i < distanceByDayData.length; i++) {
    const tweet = distanceByDayData[i];
    const key = tweet.day + "-" + tweet.activity;
    if (total[key] == undefined) {
      total[key] = {
        day: tweet.day,
        activity: tweet.activity,
        totalDistance: 0,
        count: 0,
      };
    }
    total[key].totalDistance += tweet.distance;
    total[key].count++;
  }
  for (const key in total) {
    meanByDayData.push({
      day: total[key].day,
      activity: total[key].activity,
      distance: total[key].totalDistance / total[key].count,
    });
  }
  console.log(meanByDayData);

  const mean_vis_spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description:
      "A graph of the mean distance of each individual activity by day of the week.",
    data: {
      values: meanByDayData,
    },
    mark: "point",
    encoding: {
      x: {
        field: "day",
        type: "nominal",
        sort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        axis: { title: "Time (Day)" },
      },
      y: {
        field: "distance",
        type: "quantitative",
        axis: { title: "Mean of Distance" },
      },
      color: {
        field: "activity",
        type: "nominal",
        title: "Activity",
      },
    },
  };
  let meanChart = false;

  document.getElementById("aggregate").onclick = function () {
    meanChart = !meanChart;

    if (meanChart == true) {
      vegaEmbed("#distanceVis", mean_vis_spec, { actions: false });
      document.getElementById("aggregate").innerText = "Show all activities";
    } else {
      vegaEmbed("#distanceVis", distance_vis_spec, { actions: false });
      document.getElementById("aggregate").innerText = "Show means";
    }
  };
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
  loadSavedRunkeeperTweets().then(parseTweets);
});
