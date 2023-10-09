var writtenArray = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	var numberCounter = 0;

	for (var i = 0; i < tweet_array.length; i++) {
		if(tweet_array[i].written && tweet_array[i].writtenText != '') {
			numberCounter++;
			writtenArray.push(tweet_array[i]);
		}
	}
}

function addEventHandlerForSearch() {
	// Search text as text is being put into search box
	var search = document.querySelector('input');
	var searchText = document.getElementById('searchText');
	searchText.innerText = '';
	// Search count as text is being put into search box
	var searchCount =  document.getElementById('searchCount');
	searchCount.innerText = 0;
	// Array to store tweets matching input
	var matchingTweets = [];
	// Event handling for input
	search.addEventListener('input', updateValues);
	function updateValues(event) {
		// Update search text
		searchText.textContent = event.target.value;

		const table = document.getElementById('tweetTable');

		// Look for matching user-written tweets
		// Update count of matching tweet and assign each matching tweet a number
		// Update table with matching tweet numbers, activity types, and tweets
		var tweetCounter = 0;
		for (var i = 0; i < writtenArray.length; i++) {
			// Get matching tweets
			if (writtenArray[i].text.includes(event.target.value)) {
				// Add matching tweets to matchingTweets array
				matchingTweets.push(writtenArray[i].text);
				// Increment matching tweet counter
				tweetCounter++;
				// Update number of matching tweets
				searchCount.innerText = tweetCounter;
			}
			if (event.target.value == '') {
				// Set number of matching tweets to 0 when text box is empty
				tweetCounter = 0;
				// Update number of matching tweets
				searchCount.innerText = tweetCounter;
			}
		}

		// Update table based on search
		if (event.target.value != '') {
			// Get matching tweets
			matchingTweets = writtenArray.filter(function(t) {
				return t.writtenText.includes(event.target.value);
			});
			// Empty table
			$('#tweetTable').empty();
			// Add matching tweets to table
			for (var i = 0; i < matchingTweets.length; i++) {
				$('#tweetTable').append(matchingTweets[i].getHTMLTableRow(i + 1));
			}
		} else {
			// Empty table if search box is empty
			$('#tweetTable').empty();
		}

	}
}
//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});