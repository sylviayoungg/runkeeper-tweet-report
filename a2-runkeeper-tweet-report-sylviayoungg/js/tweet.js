"use strict";
class Tweet {
    constructor(tweet_text, tweet_time) {
        this.text = tweet_text;
        this.time = new Date(tweet_time); //, "ddd MMM D HH:mm:ss Z YYYY"
    }
    //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source() {
        var tweet = this.text.toLowerCase();
        if (tweet.includes('completed') || tweet.includes('posted')) {
            return 'completed_event';
        }
        else if (tweet.includes('now') || tweet.includes('live')) {
            return 'live_event';
        }
        else if (tweet.includes('achieved') || tweet.includes('achievment') || tweet.includes('achieved') || tweet.includes('goal')) {
            return 'achievement';
        }
        else {
            return 'miscellaneous';
        }
    }
    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written() {
        if (this.text.includes('-') && !this.text.includes('TomTom')) {
            return true;
        }
        return false;
    }
    get writtenText() {
        if (!this.written) {
            return "";
        }
        return this.text;
    }
    // Gets type of activity logged from tweet
    get activityType() {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        var tweet = this.text;
        // Get activity from tweet as string
        if (tweet.includes('km')) {
            let substring = tweet.split('km');
            let activity = substring[1].split(' ');
            if (activity[2] == 'in' || activity[2] == 'with' || activity[2] == '-' || activity[2] == '@') {
                return activity[1];
            }
            else {
                return activity[2];
            }
        }
        else if (tweet.includes('mi')) {
            let substring = tweet.split('mi');
            let activity = substring[1].split(' ');
            if (activity[2] == 'in' || activity[2] == 'with' || activity[2] == '-' || activity[2] == '@') {
                return activity[1];
            }
            else {
                return activity[2];
            }
        }
        return '';
    }
    // Gets the distance an activity was performed for
    // For activities that involves distance, ignores activities that do not involve distance, i.e. duration activities
    get distance() {
        if (this.source != 'completed_event') {
            return 0;
        }
        var tweet = this.text.toLowerCase();
        var distance = 0;
        var matches = tweet.match(/\d+/g);
        if (tweet.includes('km') && matches != null) {
            var distance_km = Number(matches[0]);
            distance = Number((distance_km / 1.609).toFixed(2));
        }
        else if (tweet.includes('mi') && matches != null) {
            distance = Number(matches[0]);
        }
        return distance;
    }
    getHTMLTableRow(rowNumber) {
        // Get start position of url
        var urlStart = this.text.search('https://t.co');
        // Get end position of url
        var urlEnd = this.text.lastIndexOf('#Runkeeper');
        // Get only url without other text in tweet
        var urlString = this.text.substring(urlStart, urlEnd);
        // Return all row elements with HTML table tags
        return "<tr><td>" + rowNumber + "</td><td>" + this.activityType + "</td><td>" + this.text.substring(0, urlStart) +
            "<a href='" + urlString + "'>" + urlString + '</a>' + this.text.substring(urlEnd) + "</td></tr>";
    }
}
