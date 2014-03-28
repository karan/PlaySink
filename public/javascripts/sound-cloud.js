"use strict";

// Initializes the app
SC.initialize({
  client_id: 'edefe43facff0422cfa99623ffec3ab4'
});


// Given the stream id it will stream the song using the sdk
function stream(id) {
	SC.stream("/tracks/" + id, function(sound) {
			sound.play();
			console.log('Playing song: ' + sound);
	});
}

// Shitty search funtionality
$('#search').click(function() {
	var title = $('#search_box').val();
	console.log("Searching for: " + title);
	//console.log('hi');
	// Will search for the track
	SC.get('/tracks', { q: title}, function (tracks) {
		if (!tracks) {
			console.log("no tracks found");
		} else {
			// filters only the songs we can stream
			var playable = tracks.filter(function(val, i, arr) { return val.streamable });
			
			if (!playable) console.log('no songs able to stream');

			// puts the most played songs in the front
			playable.sort(function(a, b) {
				return b.playback_count - a.playback_count;
			});
		}

		// Because fuck angular
		for (var i = 0; i < 5; i++) {
			var title = playable[i].title;
			var artist = playable[i].user.username;
			var id = playable[i].id;
			var track = '<a class="list-group-item search-result tracks" id=' + id + '>' +
						title + ' - ' + artist + '</a>';
			$('#results').append(track);
		}

		$('.tracks').click(function() { stream(this.id); });
	});
});