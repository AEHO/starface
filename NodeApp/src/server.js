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
  res.send('YOU SHOULDN\'T BE HERE!!!!!');
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

    socket.on('mobile-accelerometer', function (data) {
      socket.broadcast.emit('accelerometer', data);
      console.log(data);
    });
  });
}

// OBTEM O IP LOCAL DO CARA

function getLocalIp () {
    var ifaces = require('os').networkInterfaces();
    var wlan0 = ifaces['wlan0'];

    if (!wlan0) {
        return;
    }

    return wlan0.length > 1 ? wlan0[0].address : '';
};

$('#ip').text(getLocalIp());
