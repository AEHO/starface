$(function () {
  $.ajaxSetup({ cache: true});
  $.getScript('//connect.facebook.net/en_UK/all.js', function(){
    FB.init({
      appId: '307657009382643',
    });

    FB.Event.subscribe('auth.authResponseChange', function (response) {
      if (response.status === 'connected') {
        var uid = response.authResponse.useID;
        var accessToken = response.authResponse.accessToken;

        console.log(uid);

        FB_OK = true;

        var fba = new FBApi();
        fba.getStream().then(function (response) {
          console.log(response);
        });

      } else if (response.status === 'not_authorized') {
        // not authorized :(
      } else {
        // an error ocurred
      }
    });

  });
});

var Space = (function(){
  var scene;
  var camera;
  var renderer;
  var maxAnisotropy;
  var canvas;
  var context;
  var texture;
  var material;
  var boxes = [];
  var nextRefreshZ = -10;
  var keysPressed = {
    Up: false,
    Down: false,
    Left: false,
    Right: false
  };

  var module = {};

  var setContextContent = function(){
    context = canvas.getContext('2d');
    context.font = "Bold 120px Helvetica";
    context.lineWidth = 4;
    context.strokeStyle = 'rgba(255,255,255,.8)';
    context.fillStyle = "rgba(0,0,0,1)";
    context.strokeText("Testing", 10, 120);
    context.fillText("Testing", 10, 120);
  }

  var addBox = function(canvas){
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    texture.anisotropy = maxAnisotropy;
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var geometry = new THREE.BoxGeometry(3,3,0.1);
    var box = new THREE.Mesh(geometry, material);
    box.position.x = camera.position.x + Math.random() * 20 - 10;
    box.position.y = camera.position.y + Math.random() * 20 - 10;
    box.position.z = camera.position.z + Math.random() * 30 - 35;
    boxes.push(box);
    scene.add(box);
  }

  var loadMore = function(){
    for(var i=0; i < 2; i++){
      addBox(canvas);
    }
  }

  module.init = function(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    maxAnisotropy = renderer.getMaxAnisotropy();
    canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    setContextContent()
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    for(var i=0; i < 20; i++){
      addBox(canvas);
    }
    camera.position.z = 3;
  }

  module.events = function(){
    $(window).keydown(function(e){
      keysPressed[e.originalEvent.keyIdentifier] = true;
    });

    $(window).keyup(function(e){
      keysPressed[e.originalEvent.keyIdentifier] = false;
    });

  }

  module.render = function () {
    requestAnimationFrame(module.render);
    if(keysPressed.Up){
      camera.position.z -= 0.1;
      if(camera.position.z < nextRefreshZ){
        nextRefreshZ -= 1;
        loadMore();
      }
    }
    if(keysPressed.Down){
      camera.position.z += 0.1;
    }
    if(keysPressed.Right){
      camera.position.x += 0.1;
    }
    if(keysPressed.Left){
      camera.position.x -= 0.1;
    }
    renderer.render(scene, camera);
  };

  return module;

}());

Space.init();
Space.events();
Space.render();
