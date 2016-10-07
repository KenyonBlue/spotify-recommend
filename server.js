var unirest = require('unirest');
var express = require('express');
var events = require('events');

var getFromApi = function(endpoint, args) {
    var emitter = new events.EventEmitter();
    unirest.get('https://api.spotify.com/v1/' + endpoint)
           .qs(args)
           .end(function(response) {
                if (response.ok) {
                    emitter.emit('end', response.body);
                }
                else {
                    emitter.emit('error', response.code);
                }
            });
    return emitter;
};

var app = express();
app.use(express.static('public'));

app.get('/search/:name', function(req, res) {
    var searchReq = getFromApi('search', {
        q: req.params.name,
        limit: 1,
        type: 'artist'
    });

    searchReq.on('end', function(item) {
        var artist = item.artists.items[0];
        res.json(artist);
    });

    searchReq.on('error', function(code) {
        res.sendStatus(code);
    });
});

app.listen(process.env.PORT || 8080);

{
  "artists" : [ {
    "external_urls" : {
      "spotify" : "https://open.spotify.com/artist/5ZKMPRDHc7qElVJFh3uRqB"
    },
    "followers" : {
      "href" : null,
      "total" : 18108
    },
    "genres" : [ "rockabilly" ],
    "href" : "https://api.spotify.com/v1/artists/5ZKMPRDHc7qElVJFh3uRqB",
    "id" : "5ZKMPRDHc7qElVJFh3uRqB",
    "images" : [ {
      "height" : 997,
      "url" : "https://i.scdn.co/image/beff5827580bcc4d129cbc0872768095eeba8c14",
      "width" : 1000
    }, {
      "height" : 638,
      "url" : "https://i.scdn.co/image/dbabf703779789917c4dd1c0e54da62c7a45ce92",
      "width" : 640
    }, {
      "height" : 199,
      "url" : "https://i.scdn.co/image/74761c343bec27c814b8e44e4bc095cbf1b674bb",
      "width" : 200
    }, {
      "height" : 64,
      "url" : "https://i.scdn.co/image/0c30af5647c74fee14fb97981c23b336abbc9f21",
      "width" : 64
    } ],
    "name" : "Wanda Jackson",
    "popularity" : 59,
    "type" : "artist",
    "uri" : "spotify:artist:5ZKMPRDHc7qElVJFh3uRqB"
  }, {
    ...
  } ]
}