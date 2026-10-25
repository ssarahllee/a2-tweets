class Tweet {
  private text: string;
  time: Date;

  constructor(tweet_text: string, tweet_time: string) {
    this.text = tweet_text;
    this.time = new Date(tweet_time); //, "ddd MMM D HH:mm:ss Z YYYY"
  }

  //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
  get source(): string {
    //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
    // live event
    if (
      this.text.startsWith("Just completed") ||
      this.text.startsWith("Just posted")
    ) {
      return "completed_event";
    } else if (
      this.text.includes("Runkeeper Live") ||
      this.text.startsWith("Watch my")
    ) {
      return "live_event";
    } else if (this.text.startsWith("Achieved")) {
      return "achievement";
    }
    return "miscellaneous";
  }

  //returns a boolean, whether the text includes any content written by the person tweeting.
  get written(): boolean {
    //TODO: identify whether the tweet is written
    const split = this.text.split(" - ");
    // if only one element
    if (split.length < 2) {
      return false;
    }
    let tweetText = split.slice(1).join(" - ");
    const hashtagIndex = tweetText.indexOf("#Runkeeper");
    if (hashtagIndex != -1) {
      tweetText = tweetText.replace("#Runkeeper", "");
    }
    const urlIndex = tweetText.indexOf("https");
    if (urlIndex != -1) {
      tweetText = tweetText.substring(0, urlIndex);
    }
    tweetText = tweetText.trim();
    if (tweetText.length > 0) {
      return true;
    }
    return false;
  }

  get writtenText(): string {
    if (!this.written) {
      return "";
    }
    //TODO: parse the written text from the tweet
    const split = this.text.split(" - ");
    // if only one element
    if (split.length < 2) {
      return "";
    }
    let tweetText = split.slice(1).join(" - ");
    const hashtagIndex = tweetText.indexOf("#Runkeeper");
    if (hashtagIndex != -1) {
      tweetText = tweetText.replace("#Runkeeper", "");
    }
    const urlIndex = tweetText.indexOf("https");
    if (urlIndex != -1) {
      tweetText = tweetText.substring(0, urlIndex);
    }
    tweetText = tweetText.trim();
    return tweetText;
  }

  get activityType(): string {
    if (this.source != "completed_event") {
      return "unknown";
    }
    //TODO: parse the activity type from the text of the tweet
    // first check if tweet contains km or mi to then identify activity
    const lower = this.text.toLowerCase();
    const kmIndex = lower.indexOf(" km ");
    const miIndex = lower.indexOf(" mi ");
    let distanceIndex = 0;
    if (kmIndex != -1) {
      distanceIndex = kmIndex;
    } else if (miIndex != -1) {
      distanceIndex = miIndex;
    } else {
      return "unknown";
    }

    // get remaining text after the unit
    const afterUnit = lower.substring(distanceIndex + 4).trim();
    // get specific activity after the unit
    //const activity = afterUnit.split(" ")[0];
    const activity = afterUnit.split(" with ")[0].split("-")[0].trim();
    if (activity == "activity") {
      return "unknown";
    }
    return activity;
    /*
    if (activity.startsWith("run")) return "run";
    if (activity.startsWith("walk")) return "walk";
    if (activity.startsWith("bike") || activity.startsWith("cycl"))
      return "bike";
    if (activity.startsWith("hike")) return "hike";
    if (activity.startsWith("swim")) return "swim";
    if (activity.startsWith("ski")) return "ski";
    if (activity.startsWith("row")) return "row";
    if (activity.startsWith("elliptical")) return "elliptical";

    return "unknown"; */
  }

  get distance(): number {
    if (this.source != "completed_event") {
      return 0;
    }
    //TODO: prase the distance from the text of the tweet
    const lower = this.text.toLowerCase();
    const kmIndex = lower.indexOf(" km ");
    const miIndex = lower.indexOf(" mi ");
    let distanceIndex = 0;
    if (kmIndex != -1) {
      distanceIndex = kmIndex;
    } else if (miIndex != -1) {
      distanceIndex = miIndex;
    } else {
      return 0;
    }

    // get remaining text before the distance
    const beforeDistance = lower.substring(0, distanceIndex).trim();
    // split into words
    const words = beforeDistance.split(" ");
    // get the distance number
    const distance = words[words.length - 1];
    const distanceNum = parseFloat(distance);
    // convert km to m
    if (kmIndex != -1) {
      return distanceNum / 1.609;
    }
    return distanceNum;
  }

  getHTMLTableRow(rowNumber: number): string {
    //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
    let tweet = this.text;
    const urlIndex = tweet.indexOf("https://");

    if (urlIndex !== -1) {
      const beforeURL = tweet.substring(0, urlIndex);
      const afterURL = tweet.substring(urlIndex);
      const url = afterURL.split(" ")[0];
      const restOfText = afterURL.substring(url.length);
      tweet = `${beforeURL}<a href="${url}" target="_blank">${url}</a>${restOfText}`;
    }
    return `
      <tr>
        <td>${rowNumber}</td>
        <td>${this.activityType}</td>
        <td>${tweet}</td>
      </tr>
    `;
  }
}
