var express = require('express');
var FB = require('fb');

var app = express();
var io;
var server = app.listen(3000, "0.0.0.0", function () {
  console.log("Listening on port %d", server.address().port);

  handleSocketsStuff();
});

// ROUTES

app.get('/', function (req, res) {
  res.send('hellowolrd');
});


// GETTING APPLICATION ACCESSTOKEN

FB.api('oauth/access_token', {
  client_id: '307657009382643',
  client_secret: '4fc2122807b6026e56037c5e05763656',
  grant_type: 'client_credentials'
}, function (res) {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }

  var accessToken = res.access_token;

  console.log(accessToken);
});

// SOCKETIO STUFF

function handleSocketsStuff () {

  io = require('socket.io').listen(server);
  io.sockets.on('connection', function (socket) {
    socket.emit('news', {hello: 'world'});

    socket.on('accelerometer', function (data) {
      console.log(data);
    });
  });
}
