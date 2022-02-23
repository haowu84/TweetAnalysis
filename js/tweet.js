"use strict";
class Tweet {
    constructor(tweet_text, tweet_time) {
        this.text = tweet_text;
        this.time = new Date(tweet_time); //, "ddd MMM D HH:mm:ss Z YYYY"
    }
    //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source() {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if (this.text.includes("Just completed") ||
            this.text.includes("Just posted")) {
            return "completed_event";
        }
        else if (this.text.includes("#RKLive")) {
            return "live_event";
        }
        else if (this.text.includes("Achieved") ||
            this.text.includes("set a goal")) {
            return "achievement";
        }
        else {
            return "miscellaneous";
        }
    }
    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written() {
        //TODO: identify whether the tweet is written
        if (this.text.includes(" - ") &&
            !this.text.includes("TomTom MySports Watch")) {
            return true;
        }
        else {
            return false;
        }
    }
    get writtenText() {
        if (!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        var index1 = this.text.search(/[#@]Runkeeper/i);
        var index2 = this.text.search("https");
        var index = index1 < index2 ? index1 : index2;
        return this.text.substring(0, index);
    }
    get activityType() {
        if (this.source != "completed_event") {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        var start = -1;
        var end = -1;
        var activity = "unknown";
        if (this.text.search(" km ") != -1) {
            start = this.text.search(" km ") + 4;
            var index1 = this.text.search(" with ");
            var index2 = this.text.search(" - ");
            var end = index2 == -1 ? index1 : index2;
            activity = this.text.substring(start, end);
        }
        else if (this.text.search(" mi ") != -1) {
            start = this.text.search(" mi ") + 4;
            var index1 = this.text.search(" with ");
            var index2 = this.text.search(" - ");
            var end = index2 == -1 ? index1 : index2;
            activity = this.text.substring(start, end);
        }
        return activity;
    }
    get distance() {
        if (this.source != "completed_event") {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        var start = -1;
        var end = -1;
        var dist = 0;
        if (this.text.search(" km ") != -1) {
            end = this.text.search(" km ");
            start = this.text.search(" a ") + 3;
            dist = parseFloat(this.text.substring(start, end)) / 1.609;
        }
        else if (this.text.search("mi") != -1) {
            end = this.text.search(" mi ");
            start = this.text.search(" a ") + 3;
            dist = parseFloat(this.text.substring(start, end));
        }
        return dist;
    }
    getHTMLTableRow(rowNumber) {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        var url = this.text.split(" ").slice(-2)[0];
        return ("<tr>" +
            "<td>" +
            rowNumber +
            "</td>" +
            "<td>" +
            this.activityType +
            "</td>" +
            "<td>" +
            this.text.replace(url, "<a href=" + url + ">" + url + "</a>") +
            "<td>" +
            "</tr>");
    }
}
