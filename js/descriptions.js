var tweet_array = [];

function parseTweets(runkeeper_tweets) {
  //Do not proceed if no tweets loaded
  if (runkeeper_tweets === undefined) {
    window.alert("No tweets returned");
    return;
  }

  //TODO: Filter to just the written tweets
  tweet_array = runkeeper_tweets.map(function (tweet) {
    return new Tweet(tweet.text, tweet.created_at);
  });
}

function addEventHandlerForSearch() {
  //TODO: Search the written tweets as text is entered into the search box, and add them to the table
  $("#searchText").text($("#textFilter").val());
  var searchText = $("#searchText").text().toLowerCase();
  $("#tweetTable").empty();
  $("#searchCount").text(0);
  if (searchText) {
    var row = 1;
    for (var i = 0; i < tweet_array.length; i++) {
      tweet = tweet_array[i];
      if (tweet.writtenText.toLowerCase().includes(searchText)) {
        $("#tweetTable").append(tweet.getHTMLTableRow(row));
        row += 1;
      }
    }
    $("#searchCount").text(row - 1);
  }
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
  $("#textFilter").on("input", addEventHandlerForSearch);
  loadSavedRunkeeperTweets().then(parseTweets);
});
