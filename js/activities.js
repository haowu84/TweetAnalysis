function parseTweets(runkeeper_tweets) {
  //Do not proceed if no tweets loaded
  if (runkeeper_tweets === undefined) {
    window.alert("No tweets returned");
    return;
  }

  tweet_array = runkeeper_tweets.map(function (tweet) {
    return new Tweet(tweet.text, tweet.created_at);
  });

  var frequency = {};
  var activities = [];
  var days = {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
  };

  //Count the number of distance-based activities
  for (var i = 0; i < tweet_array.length; i++) {
    tweet = tweet_array[i];
    if (tweet.activityType != "unknown") {
      if (tweet.activityType in frequency) {
        frequency[tweet.activityType] += 1;
      } else {
        frequency[tweet.activityType] = 1;
      }
      activities.push({
        activity: tweet.activityType,
        distance: tweet.distance,
        day: days[tweet.time.getDay()],
      });
    }
  }

  //Find the top 3 activities
  var frequent = [];
  for (var activity in frequency) {
    frequent.push({ activity: activity, frequency: frequency[activity] });
  }
  frequent.sort(function (a, b) {
    return b.frequency - a.frequency;
  });

  $("#numberActivities").text(frequent.length);
  var first = frequent[0].activity;
  var second = frequent[1].activity;
  var third = frequent[2].activity;
  $("#firstMost").text(first);
  $("#secondMost").text(second);
  $("#thirdMost").text(third);

  weekendDistance = {};
  weekdayDistance = {};
  weekendDistance[first] = [];
  weekendDistance[second] = [];
  weekendDistance[third] = [];
  weekdayDistance[first] = [];
  weekdayDistance[second] = [];
  weekdayDistance[third] = [];

  //Record the distances, frequency, and weekday/weekend of the top 3 activities
  var topActivities = activities.filter(function (act) {
    return (
      act.activity == first || act.activity == second || act.activity == third
    );
  });
  for (var act of topActivities) {
    if (act.day == "Sun" || act.day == "Sat") {
      weekendDistance[act.activity].push(act.distance);
    } else {
      weekdayDistance[act.activity].push(act.distance);
    }
  }

  function sum(total, value) {
    return total + value;
  }

  //Determine the longest/shortest activities based on average distances
  dist = [];
  dist.push({
    activity: first,
    averageDistance:
      (weekendDistance[first].reduce(sum) +
        weekdayDistance[first].reduce(sum)) /
      (weekendDistance[first].length + weekdayDistance[first].length),
  });
  dist.push({
    activity: second,
    averageDistance:
      (weekendDistance[second].reduce(sum) +
        weekdayDistance[second].reduce(sum)) /
      (weekendDistance[second].length + weekdayDistance[second].length),
  });
  dist.push({
    activity: third,
    averageDistance:
      (weekendDistance[third].reduce(sum) +
        weekdayDistance[third].reduce(sum)) /
      (weekendDistance[second].length + weekdayDistance[third].length),
  });
  dist.sort(function (a, b) {
    return b.averageDistance - a.averageDistance;
  });

  $("#longestActivityType").text(dist[0].activity);
  $("#shortestActivityType").text(dist[2].activity);

  //Compare the average distances on weekends and weekdays
  var longest = dist[0].activity;
  var longer =
    weekendDistance[longest].reduce(sum) / weekendDistance[longest].length >
    weekdayDistance[longest].reduce(sum) / weekdayDistance[longest].length
      ? "weekends"
      : "weekdays";
  $("#weekdayOrWeekendLonger").text(longer);

  //TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
  activity_vis_spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    description:
      "A graph of the number of Tweets containing each type of activity.",
    data: {
      values: activities,
    },
    //TODO: Add mark and encoding
    mark: "bar",
    encoding: {
      x: { field: "activity", type: "nominal", sort: "-y" },
      y: { type: "quantitative", aggregate: "count" },
    },
  };
  vegaEmbed("#activityVis", activity_vis_spec, { actions: false });

  var daysOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  //TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
  //Use those visualizations to answer the questions about which activities tended to be longest and when.
  dist_vis_spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    description:
      "A plot of the distances by day of the week for all of the three most tweeted-about activities.",
    data: {
      values: topActivities,
    },
    mark: "point",
    encoding: {
      x: {
        title: "time (day)",
        field: "day",
        type: "ordinal",
        sort: daysOrder,
      },
      y: {
        field: "distance",
        type: "quantitative",
      },
      color: {
        field: "activity",
        type: "nominal",
        title: "Activities",
      },
      shape: {
        field: "activity",
        type: "nominal",
        title: "Activities",
      },
    },
  };
  vegaEmbed("#distanceVis", dist_vis_spec, { actions: false });

  dist_vis_agg_spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    description:
      "A plot of the distances by day of the week for all of the three most tweeted-about activities, aggregating the activities by the mean.",
    data: {
      values: topActivities,
    },
    mark: "point",
    encoding: {
      x: {
        title: "time (day)",
        field: "day",
        type: "ordinal",
        sort: daysOrder,
      },
      y: {
        field: "distance",
        type: "quantitative",
        aggregate: "mean",
      },
      color: {
        field: "activity",
        type: "nominal",
        title: "Activities",
      },
      shape: {
        field: "activity",
        type: "nominal",
        title: "Activities",
      },
    },
  };
  vegaEmbed("#distanceVisAggregated", dist_vis_agg_spec, { actions: false });
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
  loadSavedRunkeeperTweets().then(parseTweets);

  //Graph alternate
  $("#distanceVisAggregated").hide();
  $("#aggregate").click(function () {
    var element = $(this);
    var sign =
      element.text() == "Show means" ? "Show all activities" : "Show means";
    element.text(sign);
    $("#distanceVis, #distanceVisAggregated").toggle();
  });
});
