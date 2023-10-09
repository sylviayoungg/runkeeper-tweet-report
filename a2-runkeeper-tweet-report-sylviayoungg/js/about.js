function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	// For formating dates as weekday, month date, year
	const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
	// Updates start date of tweets
	document.getElementById('firstDate').innerText = tweet_array[tweet_array.length - 1].time.toLocaleDateString("en-US", options);
	// Updates end date of tweets
	document.getElementById('lastDate').innerText = tweet_array[0].time.toLocaleDateString("en-US", options);
	
	var completed = 0, live = 0, achievement = 0, miscellaneous = 0, userWritten = 0;
	// Updates number of completed, live, achievement, miscellaneous tweets, and user-written tweets of completed events
	for (var i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].source === 'completed_event') {
			completed++;
			if (tweet_array[i].written){
				userWritten++;
			}
		} else if (tweet_array[i].source === 'live_event') {
			live++;
		} else if (tweet_array[i].source === 'achievement') {
			achievement++;
		} else {
			miscellaneous++;
		}
	}
	// Number of tweets in each category
	document.getElementsByClassName('completedEvents')[0].innerText = completed;
	document.getElementsByClassName('liveEvents')[0].innerText = live;
	document.getElementsByClassName('achievements')[0].innerText = achievement;
	document.getElementsByClassName('miscellaneous')[0].innerText = miscellaneous;
	// Percentage of tweets in each category
	document.getElementsByClassName('completedEventsPct')[0].innerText = (100 * (completed/tweet_array.length)).toFixed(2) + '%';
	document.getElementsByClassName('liveEventsPct')[0].innerText = (100 *(live/tweet_array.length)).toFixed(2) + '%';
	document.getElementsByClassName('achievementsPct')[0].innerText = (100 *(achievement/tweet_array.length)).toFixed(2) + '%';
	document.getElementsByClassName('miscellaneousPct')[0].innerText = (100 * (miscellaneous/tweet_array.length)).toFixed(2) + '%';

	// User-written tweet info
	document.getElementsByClassName('completedEvents')[1].innerText = completed;
	document.getElementsByClassName('written')[0].innerText = userWritten;
	document.getElementsByClassName('writtenPct')[0].innerText = (100 * (userWritten/completed)).toFixed(2) + '%';

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});