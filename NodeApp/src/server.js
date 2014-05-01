#!/usr/bin/env node

var express = require('express');
var app = express();
var io;
var server = app.listen(3000, "0.0.0.0", function () {
  console.log("Listening on port %d", server.address().port);

  handleSocketsStuff();
});


app.get('/', function (req, res) {
  res.send('hellowolrd');
});

function handleSocketsStuff () {

  io = require('socket.io').listen(server);
  io.sockets.on('connection', function (socket) {
    socket.emit('news', {hello: 'world'});

    socket.on('my other event', function (data) {
      console.log(data);
    });
  });
}
