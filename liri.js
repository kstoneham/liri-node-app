var dotenv = require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var request = require("request");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var command = process.argv[2];

switch (command) {
    case "my-tweets":
        myTweets();
        break;
    case "spotify-this-song":
        spotifyThis();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        doThis();
        break;
};
function myTweets() {
    var params = {
        q: 'node',
        count: 20,
        result_type: 'recent',
        lang: 'en',
        id: "Kdub63333275"
      };
    client.get('statuses/user_timeline', params, function(error, response, tweets){
        var stream = JSON.parse(tweets.body);
        var count = 0;
        for (i = 0; i < stream.length; i++){
            count++;
            var text = stream[i].text;
            var created = stream[i].created_at;
            console.log("----------------------------------------");
            console.log(count + ": " + text);
            console.log("Created: " + created);
            console.log("----------------------------------------");
        };
        if (stream.length < 20){
            console.log("We're sorry, but this user is super lame and there aren't \nat least 20 tweets on this profile for you to see.")
        };
    });
};
function spotifyThis(thisSong) {
    var nodeArgs = process.argv;
    var songName = "";
    if (thisSong){
        songName = thisSong;
    }
    else if (!process.argv[3]){
        songName = "The Sign";
    };
    for (var i = 3; i < nodeArgs.length; i++){
        if (i > 3 && i < nodeArgs.length){
            songName = songName + "+" + nodeArgs[i];
        }
        else {
            songName += nodeArgs[i];
        };
    };
    spotify.search({ type: 'track', query: songName, limit: '1' }, function(err, data) {
        var deets = data.tracks.items[0];
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        };
        console.log("----------------------------------------------------")
        console.log("ARTIST NAME: " + deets.artists[0].name);
        console.log("SONG NAME: " + deets.name);
        if (deets.preview_url === null){
            console.log("We're sorry, but the preview URL you've requested is unavailable due to a property of null");
        }
        else {
        console.log("PREVIEW URL: " + deets.preview_url);
        };
        console.log("ALBUM NAME: " + deets.album.name);
        console.log("----------------------------------------------------")
    });
} ;  
function movieThis(thisMovie) {
    var nodeArgs = process.argv;
    var movieName = "";
    if (thisMovie){
        movieName = thisMovie;
    }
    else if (!process.argv[3]) {
        movieName = "Mr. Nobody";
    };
    for (var i = 3; i < nodeArgs.length; i++) {
        if (i > 3 && i < nodeArgs.length) {
        movieName = movieName + "+" + nodeArgs[i];
        }
        else {
        movieName += nodeArgs[i];
        };
    };
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
        var jsonData = JSON.parse(body);
        console.log("----------------------------------------------------")
        console.log("Title: " + jsonData.Title);
        console.log("Release Year: " + jsonData.Year);
        for (var i = 0; i < jsonData.Ratings.length; i++){
            if (jsonData.Ratings[i].Source !== "Metacritic"){
                console.log(jsonData.Ratings[i].Source + ":" + jsonData.Ratings[i].Value);
            };
        };
        console.log("Country: " + jsonData.Country);
        console.log("Language: " + jsonData.Language);
        console.log("Plot: " + jsonData.Plot);
        console.log("Actors: " + jsonData.Actors);
        console.log("----------------------------------------------------")
    }
    else {
        console.log("Invalid request; please try again.");
    };
  });
};
function doThis() {
    fs.readFile("random.txt", "utf8", function(error, data){
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        var runThis = dataArr[0];
        var content = dataArr[1];
        switch (runThis) {
            case "my-tweets":
                myTweets();
                break;
            case "spotify-this-song":
                spotifyThis(content);
                break;
            case "movie-this":
                movieThis(content);
                break;
        }; 
    });
};