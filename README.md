# Tweet Analysis with JavaScript, jQuery, TypeScript 

## Structure
- css/style.css: a CSS stylesheet that uses Bootstrap imports.
- index.html: root HTML file
- activities.html: HTML file
- description.html: HTML file
- data/saved_tweets.json: a JSON object containing a week’s tweets
- js/get_saved_tweets.js: a JavaScript file containing an asynchronous function that returns a week’s tweets. This file will be used to parse the data/saved_tweets.json file.
- js/about.js: a JavaScript file which edits the DOM of index.html to display information about the Tweets in the dataset.
- js/activities.js: a JavaScript file which edits the DOM of activities.html to display information about the activity types people posted to Twitter.
- js/description.js: a JavaScript file which edits the DOM of description.html to display an interface for searching through the Tweets.
- ts/tweet.ts: a TypeScript file which creates a Tweet class used to parse different parts of the text of each Tweet.

## Setup
- Installing TypeScript Transpiler: ```npm install -g typescript```
- Running TypeScript Transpiler: ```tsc --p tsconfig.json```

## Summary
### Summarize Tweets
- Identify earliest and latest tweet date
- Identify number of tweets in each category (completed events, live events, achievement, and miscellaneous)
- Identify number of tweets that contains user-written tweets

### Identify Popular Activities
- Determine most frequent, longest, and shortest activity types 
- Graph activities by distance: 
  - number of activity types
  - distances by day of the week for most frequent activities
  - distances by day of the week for most frequent activities, aggregating the activities by the mean

### Search Interface
- Update search count and text as a character is added to or removed from the search bar
- Update the table as a character is added to or removed from the search bar
