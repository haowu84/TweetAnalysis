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
  $("#numberTweets").text(tweet_array.length);

  //Find the earliest and latest Tweet Dates
  var earliest = tweet_array.reduce(function (early, tweet) {
    return tweet.time < early ? tweet.time : early;
  }, tweet_array[0].time);
  var latest = tweet_array.reduce(function (late, tweet) {
    return tweet.time > late ? tweet.time : late;
  }, tweet_array[0].time);

  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  $("#firstDate").text(earliest.toLocaleDateString("en-US", options));
  $("#lastDate").text(latest.toLocaleDateString("en-US", options));

  //Count the tweets by the different event categories, Count the user-written tweets
  var completedEvents = 0;
  var liveEvents = 0;
  var achievements = 0;
  var miscellaneous = 0;
  var writtenTexts = 0;
  for (var i = 0; i < tweet_array.length; i++) {
    tweet = tweet_array[i];
    if (tweet.source == "completed_event") {
      completedEvents += 1;
      if (tweet.written) {
        writtenTexts += 1;
      }
    } else if (tweet.source == "live_event") {
      liveEvents += 1;
    } else if (tweet.source == "achievement") {
      achievements += 1;
    } else if (tweet.source == "miscellaneous") {
      miscellaneous += 1;
    }
  }

  $(".completedEvents").text(completedEvents);
  $(".liveEvents").text(liveEvents);
  $(".achievements").text(achievements);
  $(".miscellaneous").text(miscellaneous);
  $(".completedEventsPct").text(
    ((completedEvents / tweet_array.length) * 100).toFixed(2) + "%"
  );
  $(".liveEventsPct").text(
    ((liveEvents / tweet_array.length) * 100).toFixed(2) + "%"
  );
  $(".achievementsPct").text(
    ((achievements / tweet_array.length) * 100).toFixed(2) + "%"
  );
  $(".miscellaneousPct").text(
    ((miscellaneous / tweet_array.length) * 100).toFixed(2) + "%"
  );

  $(".written").text(writtenTexts);
  $(".writtenPct").text(
    ((writtenTexts / completedEvents) * 100).toFixed(2) + "%"
  );
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
  loadSavedRunkeeperTweets().then(parseTweets);
});
