function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});


	var allActivities = [];
	const differentActivity = {};
	var differentActivities = [];
	// Add valid activity to activities array
	for (var i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].source === 'completed_event' && tweet_array[i].activityType != '' && tweet_array[i].activityType != undefined && !tweet_array[i].written) {
			var activity = tweet_array[i].activityType;
			allActivities.push(activity);
		}
	}
	// Create differentActivity object of activity and number of tweets of activity
	for (var i = 0; i < allActivities.length; i++) {
		if (!(allActivities[i] in differentActivity)) {
			differentActivity[allActivities[i]] = 1;
		} else {
			differentActivity[allActivities[i]]++;
		}
	}
	// Calculate number of different activities
	var numberActivities = Object.keys(differentActivity).length;
	// Update number of different activities
	document.getElementById('numberActivities').innerText = numberActivities;
	// Create and populate activities
	var activities = Object.keys(differentActivity).map(function(key) {
		return [key, differentActivity[key]];
	});
	// Sort activities by number of tweets of each in descending order
	activities.sort(function(key, value) {
		return value[1] - key[1];
	});
	// Update top 3 activities
	document.getElementById('firstMost').innerText = activities[0][0];
	document.getElementById('secondMost').innerText = activities[1][0];
	document.getElementById('thirdMost').innerText = activities[2][0];

	// Update longest activity and shortest activity by distance based on graph
	document.getElementById('longestActivityType').innerText = 'bike';
	document.getElementById('shortestActivityType').innerText = 'walk';
	// Update when longest activity by distance tends to occur based on graph
	document.getElementById('weekdayOrWeekendLonger').innerText = 'weekends';


	var allActivities = [];
	var allActivitiesGraph = [];
	// Create array of activity objects allActivities with activity and number keys
	for (var i = 0; i < activities.length; i++) {
		allActivities.push({"Activity": activities[i][0], "Number": activities[i][1]});
	}
	// Create array of activity objects allActivitiesGraph
	allActivitiesGraph = allActivities.map(function allActivities(tweet) {
		return {"Activity": tweet.Activity, "Number": tweet.Number};
	});

	var topActivitiesGraph = [];
	var topActivities = tweet_array.filter(function(tweet) {
		if (tweet.activityType == activities[0][0] || tweet.activityType == activities[1][0] || tweet.activityType == activities[2][0]) {
			return true;
		} else {
			return false;
		}
	});
	// Set values of values used in graph
	topActivitiesGraph = topActivities.map(function topActivities(tweet) { return {"Distance": tweet.distance, "Time": tweet.time, "Activity": tweet.activityType};});

	// All activities bar chart
	activity_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets of each activity",
		"width": 500,
		"data": {"values": allActivitiesGraph}, 
		"mark": "bar",
		"encoding" : {
			"x": {"field": "Activity", "type": "nominal", "axis": {"labelAngle": 0}}, 
			"y": {"field": "Number", "type": "quantitative"},
			"color": {"field": "Activity", "type": "nominal"}
		}
	  };
	  vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	
	var distances = true;
	document.getElementById('aggregate').onclick = mean;	

	function mean() {
		if(distances == true) {
			// Graph of mean sof distances of top 3 activities
			activity_vis_spec = {
				"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
				"description": "A graph of the number of Tweets of the means of the top 3 activities.",
				"data": {"values": topActivitiesGraph},
				"mark": "point",
				"encoding": {
					  "x": {"field": "Time", "timeUnit": "day"},
					  "y": {"field": "Distance", "aggregate": "mean"},
					  "color": {"field": "Activity", "type": "nominal"}
				  }
			  };
			distances = false;
			document.getElementById('aggregate').innerText = 'Show distance';
		} else {
			// Graph of distances of top 3
			activity_vis_spec = {
				"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
				"description": "A graph of the number of Tweets of the top 3 activities.",
				"data": {"values": topActivitiesGraph},
				"mark": "point",
				"encoding": {
					  "x": {"field": "Time", "timeUnit": "day"},
					  "y": {"field": "Distance", "type": "quantitative"},
					  "color": {"field": "Activity", "type": "nominal"}
				  }
			  };
			distances = true;
			document.getElementById('aggregate').innerText = 'Show means';
		}
		vegaEmbed('#activityVis', activity_vis_spec, {actions:false});
	}
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});