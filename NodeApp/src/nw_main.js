var gui = require('nw.gui');
var win = gui.Window.get();
var childWindow = gui
    .Window
    .get(window.open('http://localhost:8000/login'));
